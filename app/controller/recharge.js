'use strict';

const BaseController = require('./base')

class RechargeController extends BaseController{

  /**
   * 获取充值记录
   * @returns {Promise<void>}
   */
  async records(ctx) {
    const constant = this.config.constant;
    const { wallet,app_key, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_key,app_secret);
    if(!application){
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST);
      return;
    }
    const records = await this.ctx.model.RechargeRecord.getRecordByWallet(wallet);
    this.success({ records });
  }
}

module.exports = RechargeController;
