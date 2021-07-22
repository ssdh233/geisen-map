const levelup = require("levelup");
const leveldown = require("leveldown");
const fs = require('fs');

const ldb = levelup(leveldown(__dirname + "/db"));

let count = 0;
let obj = {};
ldb
  .createReadStream()
  .on("data", (x) => {
    count++;
    obj[x.key.toString()] = JSON.parse(x.value.toString());
    // console.log(x.key.toString(), x.value.toString());
  })
  .on("close", function () {
    console.log({ count });
    fs.writeFileSync("ldb.json", JSON.stringify(obj));
    ldb.close();
  });
