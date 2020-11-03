/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1604282424081_7651';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.lotus = {
    url: 'http://115.236.22.225:1234/rpc/v0',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.EfXz4KsMLrwx7JVcQ2sG54-0vJjkbvCogB4z3MpAHVs'
  };

  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    database: 'bank',
    username: "root",
    password: "123456",
    timezone: '+08:00', // 时区 - 北京时间
    logging: false, // 在终端显示数据库操作
    define: {
      timestamps: true, // 创建日期字段
      paranoid: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  };


  return {
    ...config,
    ...userConfig,
  };
};
