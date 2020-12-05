properties([
  parameters([
    booleanParam(
      defaultValue: false,
      description: 'If true, pull the lastest cralwer from github and do yarn install to update dependencies.',
      name: 'updateCrawlerBeforeRunning'
    ),
    string(defaultValue: 'bemaniCrawler', description: 'crawler name', name: 'crawler', trim: true),
    string(defaultValue: '--game iidx', description: 'crawler option', name: 'option', trim: true)
  ])
])

pipeline {
  agent any
  tools { nodejs "node15" }
  stages {
    stage('Initialization') {
      steps {
        echo params.toString()
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
    stage('Run crawler') {
      steps {
        dir("geisen-map-jenkins/server") {
          script {
            def stageName = params.crawler + " " + params.option
            stage(stageName) {
              sh "node dist/crawlers/${params.crawler}.js ${params.option} --testMode"
            }
          }
        }
      }
    }
  }
}
