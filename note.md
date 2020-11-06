#### mongodb dump & restore

```
mongodump -d ${db} -o ${output}
mongorestore --host=${host} --port=${port} -u ${user} -p ${password} --db ${db} ${path_to_bson}

# for atlas, check "Command Line Tools"
```

#### z-index
100: map 
200: main contents
500: dialog

