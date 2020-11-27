properties(
  [parameters([
    booleanParam(
      defaultValue: false,
      description: 'If true, pull the lastest cralwer from github and do yarn install to update dependencies.',
      name: 'updateCrawlerBeforeRunning'
    )
  ])
])

def crawlers;

pipeline {
  agent any
  tools { nodejs "node15" }
  stages {
    stage('Initialization') {
      steps {
        echo params.toString()
        script {
          crawlers = readJSON(file: 'jenkins/crawlerConfig.json')
          echo crawlers.toString()
        }
      }
    }
    stage('[Optional] Update crawler') {
      when {
        expression { params.updateCrawlerBeforeRunning }
      }
      steps {
        echo "running updateCrawlerBeforeRunning"
        checkout([
          $class: 'GitSCM',
          // branches: [[name: 'develop']],
          branches: [[name: 'feature/jenkins']],
          doGenerateSubmoduleConfigurations: false,
          extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'geisen-map-jenkins']],
          submoduleCfg: [],
          userRemoteConfigs: [[credentialsId: 'jenkins', url: 'https://github.com/ssdh233/geisen-map.git']]
        ])
        // yarn install
        dir("geisen-map-jenkins") {
          script {
            sh "yarn --version"
            sh "yarn"
            sh "yarn workspace server build"
          }
        }
      }
    }
    stage('Run crawlers') {
      steps {
        dir("geisen-map-jenkins/server") {
          echo "Run crawlers"
          script {
            sh "pwd"
            sh "ls"
            // show git log before running
            sh "git log -3"

            for(int i=0; i < crawlers.size(); i++) {
              def stageName = crawlers[i].name;
              if (crawlers[i].option) stageName += crawlers[i].option;
              stage(stageName){
                sh "node dist/crawlers/${crawlers[i].name}.js ${crawlers[i].option ? crawlers[i].option : ""} --testMode"
              }
            }
          }
        }
      }
    }
  }
}
