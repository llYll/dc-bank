const Service = require('egg').Service;
const { HttpJsonRpcConnector, JsonRpcProvider } = require('filecoin.js');

//定义 grpc参数
let blockHeight;
let httpConnector;
let jsonRpcProvider;


class LotusMonitorService extends Service {

  /**
   * 用户充值接听监听
   * @returns {Promise<void>}
   */
  async rechargeMonitor(){

    //获取上次监听的区块高度
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
      //高度 tipset 查询
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

            // 检查目标地址是否充值地址的接口
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
            let record = await this.ctx.model.RechargeRecord.findRecord(param);
            if(record)
              continue;
            const values = {
              version: Version,
              to: To,
              from: From,
              nonce: Nonce,
              value: Value,
              gasLimit: GasLimit,
              gasFeeCap: GasFeeCap,
              gasPremium: GasPremium,
              method: Method,
              blockCid: blockCid,
              height: blockHeight,
              params: Params,
              dealCid: dealCid,
            };
            record = await this.ctx.model.RechargeRecord.addRecord(values);
            transactionCount++
            await this.ctx.service.amqp.send(JSON.stringify(record));
            await this.ctx.model.RechargeRecord.sendRecord(record.id);
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
            let record = await this.ctx.model.RechargeRecord.findRecord(param);
            if(record)
              continue;

            const values = {
              version: Version,
              to: To,
              from: From,
              nonce: Nonce,
              value: Value,
              gasLimit: GasLimit,
              gasFeeCap: GasFeeCap,
              gasPremium: GasPremium,
              method: Method,
              blockCid: blockCid,
              height: blockHeight,
              params: Params,
              dealCid: dealCid,
            };
            record = await this.ctx.model.RechargeRecord.addRecord(values);
            transactionCount ++ ;
            const application = await this.ctx.model.Application.findByPk(wallet.appId);
            await this.ctx.service.amqp.send(application.name, JSON.stringify(record));
            await this.ctx.model.RechargeRecord.sendRecord(record.id);
          }
        } else {
          throw reason;
        }
      }
      console.log(`${blockHeight} 高度，成功监听到钱包充值交易 ${transactionCount} 笔`);
      blockHeight ++;
      await this.ctx.model.BlockHeight.setCurrentHeight(heightInfo.id, blockHeight);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 同步区块高度
   * @returns {Promise<void>}
   */
  async syncHeight(){
    const heightInfo = await this.ctx.model.BlockHeight.getHeightInfo();
    const url = this.config.lotus.url;
    const token = this.config.lotus.token;
    if (!httpConnector || !httpConnector) {
      httpConnector = new HttpJsonRpcConnector({ url, token });
      jsonRpcProvider = new JsonRpcProvider(httpConnector);
    }
    const state = await jsonRpcProvider.sync.state(); // 返回lotus同步系统的当前状态。
    if (Array.isArray(state.ActiveSyncs)) {
      const { Height: latest_height } = state.ActiveSyncs[0];
      // 更新最新区块高度
      await this.ctx.model.BlockHeight.setLatestHeight(heightInfo.id, latest_height);
      console.log(`lotus 高度节点同步正常，已同步到 ${latest_height}`);
    }
  }
}

module.exports = LotusMonitorService;
