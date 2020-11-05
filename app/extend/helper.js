const BigNumber = require('bignumber.js')

module.exports = {
  unitAmount(number, decimal = 18) {
    number = new BigNumber(number);
    decimal = new BigNumber(Math.pow(10, decimal));
    const price = number.dividedBy(decimal).toNumber();
    return price;
  }
};
