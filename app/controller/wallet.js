'use strict';

const BaseController = require('./base')

class WalletController extends BaseController{

  /**
   * 分配钱包地址
   * @returns {Promise<void>}
   */
  async dealing() {
    const  { number = 1000 } = this.ctx.request.body;
    const wallets = await  this.ctx.model.Wallet.getUnallocatedWallet(number);
    const walletsAddress = wallets.map(items=>items.wallet);
    await  this.ctx.model.Wallet.allocatedWallet(walletsAddress);
    this.success({data:walletsAddress });
  }
}

module.exports = WalletController;
