const Subscription = require('egg').Subscription;

class MonitorRecharge extends Subscription {
  static get schedule(){
    return {
      interval: '10s', // 30s 间隔
      type: 'worker', // 随机一个work执行
    };
  }

  /**
   * 监听充值
   * @param ctx
   * @returns {Promise<void>}
   */
  async subscribe(ctx) {
    await  this.ctx.service.lotusMonitor.rechargeMonitor();
  }
}
module.exports = MonitorRecharge
