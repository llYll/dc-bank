'use strict';

const BaseController = require('./base')

class WalletController extends BaseController{

  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async allocate(ctx) {
    const { number = 1000, app_id, app_secret } = this.ctx.request.body;
    const app = await this.ctx.model.Application.findApplication(app_id,app_secret);
    if(!app){
      this.failed('-10000','应用不存在');
      return;
    }
    const wallets = await this.ctx.model.Wallet.getUnallocatedWallet(number);
    const walletsAddress = wallets.map(items => items.wallet);
    await this.ctx.model.Wallet.allocatedWallet(app.id,walletsAddress);
    this.success({ wallets:walletsAddress });
  }
}

module.exports = WalletController;
