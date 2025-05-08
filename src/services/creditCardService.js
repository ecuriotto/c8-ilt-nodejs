class CreditCardService {
  constructor() {
  }

  chargeAmount(cardNumber, cvc, expiryDate, amount) {
    if (expiryDate.length !== 5) {
      console.error(`Invalid expiry date: ${expiryDate}`);
      throw new Error('Expiry date must be in MM/YY format');
    }

    console.log(
      `charging card ${cardNumber} that expires on ${expiryDate} and has cvc ${cvc} with amount of ${amount}`
    );
    console.log('payment completed');
  }
}

module.exports = {CreditCardService};
