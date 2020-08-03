const Azure = require('azure');
const msRestAzure = require('ms-rest-azure');
const pino = require('pino');
const azureCreds = require('../utils/Fetch').getAzureCreds();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

let client;

module.exports = {

  getClient: async function getClient() {
    const credentials = await msRestAzure.loginWithServicePrincipalSecret(
      azureCreds.clientId,
      azureCreds.secret,
      azureCreds.domain,
    );
    try {
      client = Azure.createComputeManagementClient(
        credentials,
        azureCreds.subrscriptionId,
      );
    } catch (err) {
      logger.error(`Error while creating Azure Client with credentials ${err}`);
    }
  },

  getVmStatus: async function getVmStatus() {
    if (client === null || client === undefined) {
      await this.getClient();
    }

    logger.info('Starting task: Get VM Status');
    logger.debug(`VM name: ${azureCreds.vmName}`);
    try {
      const instanceView = await client.virtualMachines.instanceView(
        azureCreds.resourceGroupName,
        azureCreds.vmName,
      );
      const status = instanceView.statuses[1].code;
      logger.info('Successfully executed task: Get VM Status');
      logger.debug(`Result of task: Get VM Status = ${status}`);
      return status;
    } catch (err) {
      logger.error(`Error while running the task: Get VM Status: ${err}`);
      throw err;
    }
  },

  startVm: async function startVm() {
    if (client === null || client === undefined) {
      await this.getClient();
    }
    logger.info(`Start of task: Start the VM - ${azureCreds.vmName}`);
    try {
      const startResult = await client.virtualMachines.start(
        azureCreds.resourceGroupName,
        azureCreds.vmName,
      );
      logger.info(`Successfully executed task: Start the VM - ${azureCreds.vmName}`);
      return startResult;
    } catch (err) {
      logger.error(`There was an error while executing task: Start the VM: ${err}`);
      throw err;
    }
  },

  stopVm: async function stopVm() {
    if (client === null || client === undefined) {
      await this.getClient();
    }
    logger.info(`Start of task: Stop the VM - ${azureCreds.vmName}`);
    try {
      const stopResult = await client.virtualMachines.deallocate(
        azureCreds.resourceGroupName,
        azureCreds.vmName,
      );
      logger.info(`Successfully executed task: Stop the VM - ${azureCreds.vmName}`);
      return stopResult;
    } catch (err) {
      logger.error(`There was an error while executing task: Stop the VM: ${err}`);
      throw err;
    }
  },

};
