const CustomerService = require('../services/customerService');
const CreditCardService = require('../services/creditCardService');
async function creditDeductionWorker(zeebe) {
  console.log(`Creating creditDeductionWorker...`);
  const customerService = new CustomerService();
  zeebe.createWorker({
    taskType: 'credit-deduction',
    taskHandler: (job) => {
      const { customerId, orderTotal } = job.variables;
      console.log(`handling job of type ${job.type} with customerId ${customerId} orderTotal ${orderTotal}`);
      const customerCredit = customerService.getCustomerCredit(customerId);
      // Deduct the credit and get the open order amount
      const openAmount = customerService.deductCredit(customerCredit, orderTotal);

      return job.complete({ openAmount });
    },
  });
}

async function creditCardChargingWorker(zeebe) {
  console.log(`Creating creditCardChargingWorker...`);
  const creditCardService = new CreditCardService();
  zeebe.createWorker({
    taskType: 'credit-card-charging',
    taskHandler: (job) => {
      const { cardNumber, cvc, expiryDate, openAmount } = job.variables;
      console.log(`handling job of type ${job.type}`);
      creditCardService.chargeAmount(cardNumber, cvc, expiryDate, openAmount);

      return job.complete({
        
      });
    },
  });
}

module.exports = {creditDeductionWorker, creditCardChargingWorker};
