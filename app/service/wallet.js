const Service = require('egg').Service;

class WalletService extends Service {

  async allocate(application, number){
    const wallets = await this.ctx.model.Wallet.getUnallocatedWallet(number);
    const walletsAddress = wallets.map(items => items.wallet);
    await this.ctx.model.Wallet.allocatedWallet(application.id,walletsAddress);
    return  walletsAddress;
  }
}

module.exports = WalletService;
