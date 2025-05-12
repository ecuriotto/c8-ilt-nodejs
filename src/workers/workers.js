const CustomerService = require('../services/customerService');
const { CreditCardService, InvalidCreditCardException } = require('../services/CreditCardService');
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
    taskHandler: async (job) => {
      const { cardNumber, cvc, expiryDate, openAmount } = job.variables;
      console.log(`Handling job of type ${job.type}`);

      try {
        creditCardService.chargeAmount(cardNumber, cvc, expiryDate, openAmount);
        await job.complete({});
      } catch (err) {
        if (err instanceof InvalidCreditCardException) {
          console.error(`Credit card error: ${err.message}`);
          await job.error({
            errorCode: 'creditCardChargeError',
            errorMessage: err.message,
          });
        } else {
          console.error(`Unexpected error occurred: ${err.message}`);
          await job.fail(err.message, 0);
        }
      }
    },
  });
}

const crypto = require('crypto');

async function sendMessageWorker(zeebe) {
  console.log(`Creating workers to send messages...`);

  // Worker for "payment-invocation"
  zeebe.createWorker({
    taskType: 'payment-invocation',
    taskHandler: async (job) => {
      console.log(`Task definition type: ${job.type}`);

      const variables = job.variables;
      const orderId = generateRandomOrderId(6);
      variables.orderId = orderId;

      // Publish message
      await zeebe.publishMessage({
        name: 'paymentRequestMessage',
        correlationKey: orderId,
        variables,
      });

      // Complete the job
      await job.complete(variables);
    },
  });

  // Worker for "payment-completion"
  zeebe.createWorker({
    taskType: 'payment-completion',
    taskHandler: async (job) => {
      console.log(`Task definition type: ${job.type}`);

      const variables = job.variables;
      const orderId = variables.orderId;

      try {
        await zeebe.publishMessage({
          name: 'paymentCompletedMessage',
          correlationKey: orderId,
        });

        await job.complete();
      } catch (error) {
        console.error('Could not complete job', error);
        throw error;
      }
    },
  });
}

// Utility function to generate a random order ID (letters and digits)
function generateRandomOrderId(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(crypto.randomInt(0, chars.length));
  }
  return result;
}

module.exports = {creditDeductionWorker, creditCardChargingWorker, sendMessageWorker};
