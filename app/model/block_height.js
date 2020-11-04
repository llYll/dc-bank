'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, Op } = app.Sequelize;

  const BlockHight = app.model.define('blockHeight', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      comment: '主键'
    },
    latestHeight: {
      type: INTEGER(11),
      defaultValue: 1,
      comment: " 最新区块高度"
    },
    currentHeight: {
      type: STRING(255),
      unique: true,
      comment: "当前检查到的区块高度",
    }
  },{
    tableName: 'block_height'
  });

  /**
   * 获取最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.getHeightInfo = async function() {
    const heighinfo = await this.findAll();
    return heighinfo[0];
  }


  /**
   * 更新最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.setLatestHeight = async function(id, height) {
    await this.update(
      {
        latestHeight:height,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  /**
   * 更新最新区块高度信息
   * @returns {Promise<TInstance>}
   */
  BlockHight.setCurrentHeight = async function(id, height) {
    await this.update(
      {
        currentHeight:height,
      },
      {
        where: {
          id,
        },
      }
    );
  }
  return BlockHight;
};
