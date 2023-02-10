const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const constants = require('constants');

const private = fs.readFileSync('./private.pem', 'utf8'); // openssl genrsa -out private.pem 4096
const public = fs.readFileSync('./public.pem', 'utf8'); // openssl rsa -pubout -in private.pem -out 

// JWT

const token = {
  temperature: 25,
  iat: Math.floor(Date.now() / 1000) - 30
};

console.log('[  JWT  ] token:', token);

jwt.sign(token, private, { algorithm: 'RS256' }, (err, token) => {
  console.log('[  JWT  ] token private:', token);
  jwt.verify(token, public, { algorithms: ['RS256'] }, (err, decoded) => {
    console.log('[  JWT  ] token public:', decoded);
  });
});


// AES 192

const cipher = crypto.createCipher('aes192', 'a password');
const decipher = crypto.createDecipher('aes192', 'a password');

let encrypted = cipher.update('Jurand Tadeusz Niemczycki', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('[  AES  ] encrypted:', encrypted);

let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('[  AES  ] decrypted:', decrypted);

// RSA

// Anyway, publicEncrypt / privateDecrypt use OAEP
// while privateEncrypt / publicDecrypt use PKCS1.5 padding.
// I'm not sure the its reason but I guess it might be because 
// the latter often is used for signature sign / verify which need PKCS1.5 padding scheme.

const rsaData = 'tylko i wyłącznie tekst';
console.log('[  RSA  ] rsaData:', rsaData);

// publicEncrypt

const rsaPublicEncrypt = crypto.publicEncrypt(
  {
    key: public,
    padding: constants.RSA_PKCS1_OAEP_PADDING
  },
  Buffer.from(rsaData)
);
console.log('[  RSA  ] publicEncrypt:', rsaPublicEncrypt);

// privateDecrypt

const rsaPrivateDecrypt = crypto.privateDecrypt(
  {
    key: private,
    padding: constants.RSA_PKCS1_OAEP_PADDING
  },
  Buffer.from(rsaPublicEncrypt)
).toString();
console.log('[  RSA  ] privateDecrypt:', rsaPrivateDecrypt);

// privateEncrypt

const rsaPrivateEncrypt = crypto.privateEncrypt(
  {
    key: private,
    padding: constants.RSA_PKCS1_PADDING
  },
  Buffer.from(rsaData)
);
console.log('[  RSA  ] privateEncrypt:', rsaPrivateEncrypt);

// publicDecrypt

const rsaPublicDecrypt = crypto.publicDecrypt(
  {
    key: public,
    padding: constants.RSA_PKCS1_PADDING
  },
  Buffer.from(rsaPrivateEncrypt)
).toString();
console.log('[  RSA  ] publicDecrypt:', rsaPublicDecrypt);
