const Service = require('egg').Service;
class TestService extends Service {
  async list() {
    return 1;
  }
}

module.exports = TestService;
