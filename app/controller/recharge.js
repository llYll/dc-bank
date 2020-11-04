'use strict';

const BaseController = require('./base')

class RechargeController extends BaseController{

  /**
   * 获取充值记录
   * @returns {Promise<void>}
   */
  async records(ctx) {
    const { wallet } = this.ctx.request.body;
    const records = await this.ctx.model.RechargeRecord.getRecordByWallet(wallet);
    this.success({ records });
  }
}

module.exports = RechargeController;
