const tls = require('tls');
const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// reject unauthrorized certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const private = fs.readFileSync('./private.pem'); // openssl genrsa -out private.pem 4096
const public = fs.readFileSync('./public.pem'); // openssl rsa -pubout -in private.pem -out public.pem
// openssl req -newkey rsa:4096 -nodes -x509 -days 9999 -out cert.pem -keyout key.pem
// Country Name (2 letter code) [AU]: PL
// State or Province Name(full name)[Some - State]:
// Locality Name(eg, city)[]: Lodz
// Organization Name(eg, company)[Internet Widgits Pty Ltd]: 
// Organizational Unit Name(eg, section)[]: 
// Common Name(e.g.server FQDN or YOUR name)[]: 192.168.0.3
// Email Address[]: createdbyjurand@gmail.com
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');

// Example using options from tls.connect():

const options = {
  hostname: '192.168.0.3',
  port: 443,
  path: '/',
  method: 'GET',
  key: key,
  cert: cert,
  agent: false,
  ca: [fs.readFileSync('server-cert.pem')]
};

const req = https.request(options, res => {
  res.on('data', e => console.log(e));
});


// crypto.privateDecrypt(privateKey, buffer);
// crypto.privateEncrypt(privateKey, buffer);
// crypto.publicDecrypt(key, buffer);
// crypto.publicEncrypt(key, buffer);
