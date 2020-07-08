#### mongodb dump & restore

```
mongodump -d ${db} -o ${output}
mongorestore --host=${host} --port=${port} -u ${user} -p ${password} --db ${db} ${path_to_bson}
```

#### heroku buildpack (find someway to define it in codebase)

```
heroku buildpacks:set https://github.com/heroku/heroku-buildpack-nodejs -a ${app}
heroku buildpacks:add -i 1 https://github.com/lstoll/heroku-buildpack-monorepo -a ${app}
```

#### TODOs

1. ~~recreate web app by using cra & react-router instead of next~~
2. server data update
3. deploy
4. SEO with dynamic rendering