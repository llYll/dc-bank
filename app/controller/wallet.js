'use strict';

const BaseController = require('./base')

class WalletController extends BaseController{

  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async allocate(ctx) {
    const { number = 1000, app_id, app_secret } = this.ctx.request.body;
    const application = await this.ctx.model.Application.findApplication(app_id,app_secret);
    if(!application){
      this.failed('-10000','应用不存在');
      return;
    }
    const walletsAddress = await this.ctx.service.wallet.allocate(application, number);
    this.success({ wallets:walletsAddress });
  }
}

module.exports = WalletController;
