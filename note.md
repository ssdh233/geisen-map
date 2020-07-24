#### mongodb dump & restore

```
mongodump -d ${db} -o ${output}
mongorestore --host=${host} --port=${port} -u ${user} -p ${password} --db ${db} ${path_to_bson}

# for atlas, check "Command Line Tools"
```

#### TODOs

* (S) server data update
  * (A) crawler automation
* (B) SEO dynamic rendering
* (A) user
  * checkout
    * data editing
* search enhancement: search by area/gamecenter
* statistic pages
  * gamecenter/game count
  * user edit count

(weekly)
crawler collect data -> crawler create/remove gamecenter info data

(everyday)
user updates gamecenter info data

user level:
0 can leave comments?
1 can update data after checkout
2 can close/change gamecenter's core information after checkout 10 times?
  close -> need 5 or more users to confirm