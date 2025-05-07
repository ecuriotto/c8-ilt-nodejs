class CreditCardService {
  chargeAmount(cardNumber, cvc, expiryDate, amount) {
    console.log(
      `charging card ${cardNumber} that expires on ${expiryDate} and has cvc ${cvc} with amount of ${amount}`
    );
    console.log('payment completed');
  }
}

module.exports = CreditCardService;
