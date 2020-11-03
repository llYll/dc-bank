const Subscription = require('egg').Subscription;

const { HttpJsonRpcConnector, JsonRpcProvider } = require('filecoin.js');

let httpConnector;
let jsonRpcProvider;
let blockHeight;


class RechargeRecord extends Subscription {
  static get schedule(){
    return {
      interval: '10s', // 30s 间隔
      type: 'worker', // 随机一个work执行
    };
  }


  async subscribe(ctx) {
    const heightInfo = await this.ctx.model.BlockHeight.getHeightInfo();
    blockHeight = heightInfo.currentHeight;
    if(heightInfo.currentHeight > heightInfo.latestHeight){
      return ;
    }
    const url = this.config.lotus.url;
    const token = this.config.lotus.token;
    if (!httpConnector || !httpConnector) {
      httpConnector = new HttpJsonRpcConnector({ url, token });
      jsonRpcProvider = new JsonRpcProvider(httpConnector);
    }
    try {
      const tipSet = await jsonRpcProvider.chain.getTipSetByHeight(blockHeight);

      const { Cids: blockCids } = tipSet;

      let transactionCount = 0;
      for (let i = 0; i < blockCids.length; i++) {
        const crtBlock = blockCids[i];
        const reason = await jsonRpcProvider.sync.checkBad(crtBlock); // 应该检查一个块是否被标记为 bad
        if (!reason) {
          // 根据 blockCid 获取指定区块消息
          const blockMessages = await jsonRpcProvider.chain.getBlockMessages(crtBlock);
          const { BlsMessages, SecpkMessages } = blockMessages;

          for (const transaction of BlsMessages) {
            const { Version, To, From, Nonce, Value, GasLimit, GasFeeCap, GasPremium, Method, Params, CID } = transaction;

            // 查找目标地址是充值地址的接口
            const wallet = await this.ctx.model.Wallet.findByWallet(To);
            if(!wallet)
              continue;
            const dealCid = CID['/'];
            const blockCid = blockCids[i]['/'];
            const param = {
              dealCid: dealCid,
              blockCid: blockCid,
              height: blockHeight,
            };
            const values = {
              version: Version,
              to: To,
              from: From,
              nonce: Nonce,
              value: this.ctx.helper.unitAmount(Value),
              gasLimit: GasLimit,
              gasFeeCap: GasFeeCap,
              gasPremium: GasPremium,
              method: Method,
              blockCid: blockCid,
              height: blockHeight,
              params: Params,
              dealCid: dealCid,
            };

            await this.ctx.model.RechargeRecord.addRecord(param,values);
          }
          for(let i = 0 ;i < SecpkMessages.length; i++ ){
            const { Version, To, From, Nonce, Value, GasLimit, GasFeeCap, GasPremium, Method, Params, CID } = SecpkMessages[i].Message;
            if(!To)
              continue;
            // 查找目标地址是充值地址的接口
            const wallet = await this.ctx.model.Wallet.findByWallet(To);
            if(!wallet)
              continue;
            const dealCid = CID['/'];
            const blockCid = blockCids[i]['/'];
            const param = {
              dealCid: dealCid,
              blockCid: blockCid,
              height: blockHeight,
            };
            const values = {
              version: Version,
              to: To,
              from: From,
              nonce: Nonce,
              value: this.ctx.helper.unitAmount(Value),
              gasLimit: GasLimit,
              gasFeeCap: GasFeeCap,
              gasPremium: GasPremium,
              method: Method,
              blockCid: blockCid,
              height: blockHeight,
              params: Params,
              dealCid: dealCid,
            };
            await this.ctx.model.RechargeRecord.addRecord(param,values);
          }
        } else {
          throw reason;
        }
      }
      console.log(`${blockHeight} 高度，成功同步交易 ${transactionCount} 笔`);
      blockHeight ++;
      await this.ctx.model.BlockHeight.setCurrentHeight(heightInfo.id, blockHeight);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = RechargeRecord
