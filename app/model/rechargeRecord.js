'use strict';

module.exports = app => {
  const { STRING, INTEGER,TEXT,FLOAT, DATE, Op } = app.Sequelize;

  const RechargeRecord = app.model.define('rechargeRecord', {
    id: {
      type: INTEGER(10),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    version: {
      type: INTEGER(10),
      allowNull: false,
      comment: '',
    },
    to: {
      type: STRING(255),
      allowNull: false,
      comment: '接收地址',
    },
    from: {
      type: STRING(255),
      allowNull: false,
      comment: '发送地址',
    },
    method: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      comment: '交易类型',
    },
    params: {
      type: TEXT,
      allowNull: true,
      comment: '参数',
    },
    status: {
      type: INTEGER(11),
      defaultValue: 0,
      comment: " 0: 未使用  1:已使用  2: 禁止"
    },
    nonce: {
      type: INTEGER,
      allowNull: false,
      comment: 'Nonce',
    },
    value: {
      type: FLOAT(40, 18),
      allowNull: false,
      comment: '金额，已经除以10^18',
    },
    gasLimit: {
      type: INTEGER,
      allowNull: true,
      comment: '该笔交易能消耗的最大Gas量',
    },
    gasFeeCap: {
      type: STRING(255),
      allowNull: true,
      comment: '根据区块链网络拥堵状况实时更新的基础手续费率',
    },
    gasPremium: {
      type: STRING(255),
      allowNull: false,
      comment: '用户选择支付给矿工的手续费率',
    },
    blockCid: {
      type: STRING(255),
      allowNull: false,
      comment: '区块 cid',
    },
    dealCid: {
      type: STRING(255),
      allowNull: false,
      comment: '消息 cid',
    },
    height: {
      type: INTEGER.UNSIGNED,
      allowNull: false,
      comment: '区块高度',
    }
  },{
    tableName: 'recharge_record'
  });

  //之后改成分页
  RechargeRecord.getRecordByWallet = async function(wallet) {
    return await this.findAll( {
      where: {
        to: wallet
      }
    })
  }


  RechargeRecord.addRecord = async function(param, value) {
    return await this.findCreateFind( {
      where: param,
      defaults: value
    })
  }

  return RechargeRecord;
};
