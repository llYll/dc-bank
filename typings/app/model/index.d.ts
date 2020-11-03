// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBlockHeight = require('../../../app/model/blockHeight');
import ExportRechargeRecord = require('../../../app/model/rechargeRecord');
import ExportWallet = require('../../../app/model/wallet');

declare module 'egg' {
  interface IModel {
    BlockHeight: ReturnType<typeof ExportBlockHeight>;
    RechargeRecord: ReturnType<typeof ExportRechargeRecord>;
    Wallet: ReturnType<typeof ExportWallet>;
  }
}
