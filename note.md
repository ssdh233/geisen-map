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


(weekly)
crawler collect data -> crawler create/remove gamecenter info data

(everyday)
user updates gamecenter info data

user level:
0 can leave comments?
1 can update data after checkout
2 can close/change gamecenter's core information after checkout 10 times?
  close -> need 5 or more users to confirm