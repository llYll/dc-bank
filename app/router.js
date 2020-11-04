'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/wallet/allocate', controller.wallet.allocate);
  router.post('/api/recharge/records', controller.recharge.records);
  router.get('/test', controller.wallet.test);

};
