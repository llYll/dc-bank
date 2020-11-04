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
    appId: {
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

  Application.findApplication = async function(appId, appSecret) {
    return await this.findOne( {
      where:{
        appId,
        appSecret
      }
    })
  }

  return Application;
};
