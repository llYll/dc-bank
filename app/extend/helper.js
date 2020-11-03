module.exports = {
  unitAmount(number, decimal = 18) {
    number = Number.parseInt(number);
    decimal = Math.pow(10, decimal);
    const price = number / decimal;
    return price;
  }
};
