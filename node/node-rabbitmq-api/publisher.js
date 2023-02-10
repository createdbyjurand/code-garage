#!/usr/bin/env node

// https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html

const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (err, conn) => {
  conn.createChannel((err, ch) => {
    const q = 'hello';
    const msg = 'Hello World! bla bla bla';

    ch.assertQueue(q, { durable: false });
    ch.sendToQueue(q, Buffer.from(msg));
    console.log(" [x] Sent 'Hello World!'");
  });
  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
});
