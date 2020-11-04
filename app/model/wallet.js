'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, Op } = app.Sequelize;

  const Wallet = app.model.define('wallet', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    appId: {
      type: INTEGER(11),
      defaultValue: 1,
      allowNull: false,
      comment: " 应用id 1:dc_pool"
    },
    wallet: {
      type: STRING(255),
      unique: true,
      allowNull: false,
      comment: "钱包地址",
    },
    status: {
      type: INTEGER(11),
      defaultValue: 0,
      comment: " 0: 未使用  1:已使用  2: 禁止"
    }
  },{
    tableName: 'wallet'
  });

  Wallet.getUnallocatedWallet = async function(number) {
    return await this.findAll( {
      where: {
        status: 0
      },
      limit: number
    })
  }

  Wallet.findByWallet= async function(wallet) {
    return await this.findOne( {
      where: {
        wallet
      },
    })
  }


  Wallet.allocatedWallet = async function(appId, wallets) {
    let param = {
      wallet:{
        [Op.in]: wallets
      }
    };
    return await this.update( {
      appId,
      status: 1,
    },{
      where: param
    })

  }

  return Wallet;
};
