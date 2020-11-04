const { Controller } = require('egg');
class BaseController extends Controller {
  get user() {
    return this.ctx.session.user;
  }

  success(data) {
    this.ctx.body = {
      success: true,
      code: 200,
      data,
    };
  }

  failed(code,msg) {
    this.ctx.body = {
      success: false,
      code,
      msg
    };
  }

  notFound(msg) {
    msg = msg || 'not found';
    this.ctx.throw(404, msg);
  }
}
module.exports = BaseController;
