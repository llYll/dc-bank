'use strict';

const BaseController = require('./base')

class WalletController extends BaseController{

  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async allocate(ctx) {
    const constant = this.ctx.config.constant;
    const { number = 1000, app_id, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_id,app_secret);
    if(!application){
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST);
      return;
    }
    const walletsAddress = await this.ctx.service.wallet.allocate(application, number);
    this.success({ wallets:walletsAddress });
  }


  async test(ctx) {
    const result = await this.ctx.service.amqp.send(JSON.stringify({data:"test"}));
    this.success(result);
  }
}

module.exports = WalletController;
