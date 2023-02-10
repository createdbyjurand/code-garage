'use strict';

const fs = require('fs');
const crypto = require("crypto");

// momentjs.com
// http://www.robertprice.co.uk/robblog/javascript_date_time_and_node_js-shtml/

// var now = new Date();
// var now = new Date(milliseconds);
// var now = new Date(dateString);
// var now = new Date(jsonDate);
// var now = new Date(year, month, day);
// var now = new Date(year, month, day, hour, minute, second, millisecond);

const date = new Date();

// console.log('[  DATE  ] date: ', date);
// console.log('[  DATE  ] date.getFullYear(): ', date.getFullYear());
// console.log('[  DATE  ] date.getMonth(): ', date.getMonth());
// console.log('[  DATE  ] date.getDay(): ', date.getDay(), '(day of the week, 0-6, sunday = 0)');
// console.log('[  DATE  ] date.getDate(): ', date.getDate());
// console.log('[  DATE  ] date.getHours(): ', date.getHours());
// console.log('[  DATE  ] date.getMinutes(): ', date.getMinutes());
// console.log('[  DATE  ] date.getSeconds(): ', date.getSeconds());
// console.log('[  DATE  ] date.getMilliseconds(): ', date.getMilliseconds());

// console.log('[  DATE  ] date.getTime(): ', date.getTime());
// console.log('[  DATE  ] date.getTimezoneOffset(): ', date.getTimezoneOffset());

// console.log('[  DATE  ] date.getUTCDate(): ', date.getUTCDate(), '(day of the month)');
// console.log('[  DATE  ] date.getUTCDay(): ', date.getUTCDay(), '(day of the week)');
// console.log('[  DATE  ] date.getUTCFullYear(): ', date.getUTCFullYear());
// console.log('[  DATE  ] date.getUTCHours(): ', date.getUTCHours());
// console.log('[  DATE  ] date.getUTCMilliseconds(): ', date.getUTCMilliseconds());
// console.log('[  DATE  ] date.getUTCMinutes(): ', date.getUTCMinutes());
// console.log('[  DATE  ] date.getUTCMonth(): ', date.getUTCMonth());
// console.log('[  DATE  ] date.getUTCSeconds(): ', date.getUTCSeconds());

// console.log('[  DATE  ] date.toDateString(): ', date.toDateString());
// console.log('[  DATE  ] date.toISOString(): ', date.toISOString());
// console.log('[  DATE  ] date.toJSON(): ', date.toJSON(), 'ISO8601');
// console.log('[  DATE  ] date.toLocaleDateString(): ', date.toLocaleDateString());
// console.log('[  DATE  ] date.toLocaleString(): ', date.toLocaleString());
// console.log('[  DATE  ] date.toLocaleTimeString(): ', date.toLocaleTimeString());
// console.log('[  DATE  ] date.toString(): ', date.toString());
// console.log('[  DATE  ] date.toTimeString(): ', date.toTimeString());
// console.log('[  DATE  ] date.toUTCString(): ', date.toUTCString());

const year = date.getFullYear();
const month = date.getMonth();
const week = date.getDay();
const day = date.getDate();
const hour = date.getHours();
const minute = date.getMinutes();
const second = date.getSeconds();
const millisecond = date.getMilliseconds();

// JSON (JavaScript Object Notation)
let json = {};

try {
  const db = fs.readFileSync('db.json');
  json = JSON.parse(db);
} catch (err) {
  console.log('[  ERROR  ] ', err);
}

const weekNames = [
  'niedziela',
  'poniedziałek',
  'wtorek',
  'środa',
  'czwartek',
  'piątek',
  'sobota'
];

const locations = [
  { 'name': 'rechniewskiego', 'rooms': 6 },
  { 'name': 'pienista', 'rooms': 2 },
  { 'name': 'gościnna', 'rooms': 2 },
  { 'name': 'skrzynki', 'rooms': 6 }
];

const randomLocation = Math.round(Math.random() * (locations.length - 1));

const value = {
  year,
  month,
  day,
  'week': weekNames[week],
  hour,
  minute,
  second,
  millisecond,
  'location': locations[randomLocation].name,
  'room': Math.round(Math.random() * (locations[randomLocation].rooms - 1) + 1),
  'temperature': Math.round(Math.random() * 100) - 50,
  'humidity': Math.round(Math.random() * 100)
};

const uid = crypto.randomBytes(24).toString("hex");
json[uid] = value;

console.log('[  INFO  ] json uid: ', json[uid]);

fs.writeFile('db.json', JSON.stringify(json), err => {
  if (err) throw err;
  console.log('[  OK  ] Data written to file');
});
