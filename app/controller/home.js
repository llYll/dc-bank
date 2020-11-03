'use strict';

const BaseController = require('./base');

class HomeController extends BaseController {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async test() {
    const { ctx } = this;

    this.success({ });
  }
}

module.exports = HomeController;
