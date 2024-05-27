const assert = require('node:assert');
const Broker = require('./src/Broker');

(async () => {
  const broker = new Broker();

  await broker.init(process.env.RABBITMQ_URL);

  await broker.sendMessage('wq', Buffer.from('foo'));

  const message1 = await broker.getMessage('wq');
  await broker.rejectMessage(message1);

  const deadLetter = await broker.getMessage('dlq');
  await broker.acceptMessage(deadLetter);

  await broker.sendMessage('wq', deadLetter.content, deadLetter.properties);

  const message2 = await broker.getMessage('wq');
  await broker.rejectMessage(message2);

  const message3 = await broker.getMessage('dlq');
  await broker.close();

  assert.equal(message3.properties.headers['x-death'][0].count, 2);

  console.log('OK');
})();

