const { Camunda8 } = require('@camunda8/sdk');
const { creditDeductionWorker, creditCardChargingWorker, sendMessageWorker } = require('./workers/workers.js');
const fs = require('fs');
const path = require('path');
const propertiesReader = require('properties-reader');

const properties = propertiesReader(path.resolve(__dirname, '../application.properties'));

async function connect() {
  // Use connection parameters from the properties file
  const c8 = new Camunda8({
    CAMUNDA_OAUTH_URL: properties.get('CAMUNDA_OAUTH_URL'),
    ZEEBE_ADDRESS: properties.get('ZEEBE_ADDRESS'),
    ZEEBE_CLIENT_ID: properties.get('ZEEBE_CLIENT_ID'),
    ZEEBE_CLIENT_SECRET: properties.get('ZEEBE_CLIENT_SECRET'),
  });

  return c8;
}

async function run() {
  const c8 = await connect();
  const zeebe = c8.getZeebeGrpcApiClient();
  // Get cluster info to verify if the connection is successful
  const topology = await zeebe.topology();
  console.log(topology);

  // Add your workers here
  creditCardChargingWorker(zeebe);
  creditDeductionWorker(zeebe);
  sendMessageWorker(zeebe);
}

run();
