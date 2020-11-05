const amqplib = require('amqplib');

const Service = require('egg').Service;

class AmqpService extends Service {

  async send(key, msg){
    try {
      const { OPTIONS, EXCHANGE_TYPE, EXCHANGE_NAME } = this.config.RABBITMQ_CONFIG;
      const conn = await amqplib.connect(OPTIONS);
      // 进程关闭的时候，关闭连接通道
      process.once('SIGINT', () => {
        console.log('意外退出');
        conn.close();
      });
      const ch = await conn.createChannel();
      let ok = ch.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE.topic, {
        durable: true,
      });

      return ok.then(() => {
        // 向交换机指定路由发送信息
        ch.publish(EXCHANGE_NAME, key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", key, msg);
        return ch.close();
      });
    }catch (e) {
      console.error(e);
    }
  }

}

module.exports = AmqpService;
