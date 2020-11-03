// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBase = require('../../../app/controller/base');
import ExportHome = require('../../../app/controller/home');
import ExportWallet = require('../../../app/controller/wallet');

declare module 'egg' {
  interface IController {
    base: ExportBase;
    home: ExportHome;
    wallet: ExportWallet;
  }
}
