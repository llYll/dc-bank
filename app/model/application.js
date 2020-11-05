'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, Op } = app.Sequelize;

  const Application = app.model.define('wallet', {
    id: {
      type: INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      comment: '主键'
    },
    appKey: {
      type: INTEGER(11),
      defaultValue: 1,
      unique: true,
      allowNull: false,
      comment: " 应用id 1:miner  2:dc_pool, 3: shangxuan_pool"
    },
    appSecret: {
      type: STRING(255),
      unique: true,
      allowNull: false,
      comment: "应用密匙",
    },
    name: {
      type: STRING(255),
      unique: true,
      allowNull: false,
      comment: " 应用名称"
    }
  },{
    tableName: 'application'
  });

  Application.findApplication = async function(appKey, appSecret) {
    return await this.findOne( {
      where:{
        appKey,
        appSecret
      }
    })
  }

  return Application;
};
