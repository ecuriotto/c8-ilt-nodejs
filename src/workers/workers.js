async function creditDeductionWorker(zeebe) {
  console.log(`Creating creditDeductionWorker...`);
  zeebe.createWorker({
    taskType: 'credit-deduction',
    taskHandler: (job) => {
      console.log(`handling job of type ${job.type}`);
      return job.complete({
        
      });
    },
  });
}

async function creditCardChargingWorker(zeebe) {
  console.log(`Creating creditCardChargingWorker...`);
  zeebe.createWorker({
    taskType: 'credit-card-charging',
    taskHandler: (job) => {
      console.log(`handling job of type ${job.type}`);
      return job.complete({
        
      });
    },
  });
}

module.exports = {creditDeductionWorker, creditCardChargingWorker};
