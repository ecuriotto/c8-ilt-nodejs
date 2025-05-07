class CustomerService {
  constructor() {
    // The customer credit are the last digits of the customer id
    this.pattern = /(.*?)(\d*)/;
  }

  /**
   * Deduct the credit for the given customer and the given amount
   *
   * @param {number} customerCredit
   * @param {number} amount
   * @returns {number} the open order amount
   */
  deductCredit(customerCredit, amount) {
    let openAmount;
    let deductedCredit;
    if (customerCredit > amount) {
      deductedCredit = amount;
      openAmount = 0.0;
    } else {
      openAmount = amount - customerCredit;
      deductedCredit = customerCredit;
    }
    console.log(`charged ${deductedCredit} from the credit, open amount is ${openAmount}`);
    return openAmount;
  }

  /**
   * Get the current customer credit
   *
   * @param {string} customerId
   * @returns {number} the current credit of the given customer
   */
  getCustomerCredit(customerId) {
    let credit = 0.0;
    const matches = customerId.match(this.pattern);

    if (matches && matches[2]) {
      credit = parseFloat(matches[2]);
    }

    console.log(`customer ${customerId} has credit of ${credit}`);
    return credit;
  }
}

module.exports = CustomerService;
