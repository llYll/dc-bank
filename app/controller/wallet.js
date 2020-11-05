'use strict';

const BaseController = require('./base')

class WalletController extends BaseController{

  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async allocate(ctx) {
    const constant = this.config.constant;
    const { number = 1000, app_key, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_key,app_secret);
    if(!application){
      this.failed(
        constant.ERROR_CODE.APPLICATION_NOT_EXIST,
        constant.ERROR_MESSAGE.APPLICATION_NOT_EXIST);
      return;
    }
    const walletsAddress = await this.ctx.service.wallet.allocate(application, number);
    this.success({ wallets:walletsAddress });
  }

}

module.exports = WalletController;
