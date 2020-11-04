const amqplib = require('amqplib');

const Service = require('egg').Service;

class AmqpService extends Service {

  async send(msg){
    const { OPTIONS, EXCHANGE_TYPE } = this.config.RABBITMQ_CONFIG;
    const conn = await amqplib.connect(OPTIONS);
    // 进程关闭的时候，关闭连接通道
    process.once('SIGINT', () => {
      console.log('意外退出');
      conn.close();
    });
    const ch = await conn.createChannel();
    let ok = ch.assertExchange('logs', EXCHANGE_TYPE.fanout, {
      durable: false,
    });

    ok = ok.then(() => {
      // 声明队列 开启独占
      ch.assertQueue('info', { exclusive: false });
      return ch.assertQueue('warn', { exclusive: false });
    });

    ok = ok.then((qok) => {
      // 队列绑定交换机
      return ch.bindQueue(qok.queue, 'logs', '').then(() => {
        return qok.queue;
      });
    });

    return ok
      .then(() => {
        ch.publish('logs', '', Buffer.from(msg));
        console.log(" [x] Sent '%s'", msg);
        return ch.close();
      })
      .catch((err) => {
        console.warn(err);
        process.exit(1);
      });
  }

}

module.exports = AmqpService;
