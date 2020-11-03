const Subscription = require('egg').Subscription;

const { HttpJsonRpcConnector, JsonRpcProvider } = require('filecoin.js');

let httpConnector;
let jsonRpcProvider;
let blockHeight;


class SyncHeight extends Subscription {
  static get schedule(){
    return {
      interval: '10s', // 30s 间隔
      type: 'worker', // 随机一个work执行
    };
  }


  async subscribe(ctx) {
    const heightInfo = await this.ctx.model.BlockHeight.getHeightInfo();
    blockHeight = heightInfo.currentHeight;
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
      console.log('lotus 高度节点同步正常');
    }
  }
}
module.exports = SyncHeight
