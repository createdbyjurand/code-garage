```
'use strict';

var fs = require('fs');
const crypto = require("crypto");
const id = crypto.randomBytes(24).toString("hex");
console.log(id);

if (fs.existsSync(path)) {
  // Do something
}

// require (synchronous)
let dbj = require('./db.json');
console.log(dbj);  

// synchronous
let db = fs.readFileSync('db.json');
let json = JSON.parse(db);
console.log(json);

// asynchronous
fs.readFile('db.json', (err, data) => {
  if (err) throw err;
  let json = JSON.parse(data);
  console.log(json);
});


var jsonTest = { 'key': 'value' };
console.log(jsonTest);
jsonTest.key2 = '...abc...';
console.log(jsonTest);


let input = JSON.stringify(json);
fs.writeFileSync('db.json', input);


let data = JSON.stringify(json, null, 2);

fs.writeFile('student-3.json', data, err => {
  if (err) throw err;
  console.log('Data written to file');
});
```
