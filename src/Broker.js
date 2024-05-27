const { setTimeout } = require('timers/promises');
const amqplib = require('amqplib');

module.exports = class Broker {

  #connection;
  #channel;

  async init(url) {
    this.#connection = await amqplib.connect(url)
    this.#channel = await this.#connection.createChannel();
    await this.#channel.assertExchange('dlx', 'direct');
    await this.#channel.assertQueue('dlq')
    await this.#channel.bindQueue('dlq', 'dlx', 'dead-letters');
    await this.#channel.assertQueue('wq', {
      arguments: {
        'x-dead-letter-exchange': 'dlx',
        'x-dead-letter-routing-key': 'dead-letters'
      }
    });

    await this.#channel.purgeQueue('wq');
    await this.#channel.purgeQueue('dlq');
  }


  async getMessage(queue) {
    const message = await this.#channel.get(queue);
    if (!message) {
      await setTimeout(1000);
      return this.getMessage(queue);
    }
    return message;
  }

  async acceptMessage(message) {
    this.#channel.ack(message);
  }

  async rejectMessage(message) {
    this.#channel.nack(message, false, false);
  }

  async sendMessage(queue, content, properties = {}) {
    await this.#channel.sendToQueue(queue, content, properties);
  }

  async close() {
    await this.#channel.close();
    await this.#connection.close();
  }
}