const proxyquire = require('proxyquire');

const expectedClientId = '1234;';
const expectedSecret = '$&CReT';
const expectedDomain = 'domain';
const expectedSubscriptionId = 'subscriptionId';
const expectedResourceGroupName = 'someResourceGroup';
const expectedVmName = 'arbitraryVm';
const expectedCredentials = 'credentials!!';
const expectedVMStatus = 'Deallocated';

let mockedFetch;
let mockedAzure;
let mockedClient;
let mockedMsRestAzure;
let mockedLogger;
let AzureClient;

beforeAll(async () => {
  mockedFetch = {
    getAzureCreds: () => ({
      subrscriptionId: expectedSubscriptionId,
      resourceGroupName: expectedResourceGroupName,
      vmName: expectedVmName,
      clientId: expectedClientId,
      secret: expectedSecret,
      domain: expectedDomain,
    }),
  };

  mockedMsRestAzure = {
    loginWithServicePrincipalSecret: (clientId, secret, domain) => {
      if (clientId === expectedClientId && secret === expectedSecret && domain === expectedDomain) {
        return expectedCredentials;
      }
      return null;
    },
  };

  mockedClient = {
    virtualMachines: {
      instanceView() {},
      start() {},
      deallocate() {},
    },
  };

  mockedAzure = {
    createComputeManagementClient: () => mockedClient,
  };

  mockedLogger = {
    error() {},
    info() {},
    debug() {},
  };

  const mockedPino = () => mockedLogger;

  AzureClient = proxyquire('../../src/client/AzureClient',
    {
      'ms-rest-azure': mockedMsRestAzure,
      '../../src/utils/Fetch': mockedFetch,
      azure: mockedAzure,
      pino: mockedPino,
    });
});

describe('getClient', () => {
  it('should call loginWithServicePrincipalSecret to generate credentials', () => {
    // GIVEN
    spyOn(mockedMsRestAzure, 'loginWithServicePrincipalSecret');

    // WHEN
    AzureClient.getClient();

    // THEN
    expect(
      mockedMsRestAzure.loginWithServicePrincipalSecret,
    ).toHaveBeenCalledWith(
      expectedClientId, expectedSecret, expectedDomain,
    );
  });

  it('should call createComputeManagementClient to create client', async () => {
    // GIVEN
    spyOn(mockedAzure, 'createComputeManagementClient');

    // WHEN
    await AzureClient.getClient();

    // THEN
    expect(
      mockedAzure.createComputeManagementClient,
    ).toHaveBeenCalledWith(
      expectedCredentials, expectedSubscriptionId,
    );
  });
});

describe('getVmStatus', () => {
  it('should return VM status by calling client.virtualMachines.instanceView(..) with the appropriate params from Fetch.getAzureCreds()', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'instanceView').and.returnValue({ statuses: ['irrelevant', { code: expectedVMStatus }] });

    // WHEN
    const actualVMStatus = await AzureClient.getVmStatus();

    // THEN
    expect(
      mockedClient.virtualMachines.instanceView,
    ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
    expect(actualVMStatus).toEqual(expectedVMStatus);
  });

  it('should catch error if client.virtualMachines.instanceView(..) fails', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'instanceView').and.returnValue(Promise.reject(new Error('test error')));
    spyOn(mockedLogger, 'error');

    // WHEN
    let actualVMStatus;
    try {
      actualVMStatus = await AzureClient.getVmStatus();
    } catch (err) {
    // THEN
      expect(
        mockedClient.virtualMachines.instanceView,
      ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
      expect(actualVMStatus).toEqual(undefined);
      expect(mockedLogger.error).toHaveBeenCalled();
    }
  });
});

describe('stopVM', () => {
  it('should stop the VM by calling client.virtualMachines.deallocate(..) with the appropriate params from Fetch.getAzureCreds()', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'deallocate');

    // WHEN
    await AzureClient.stopVm();

    // THEN
    expect(
      mockedClient.virtualMachines.deallocate,
    ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
  });

  it('should catch error if client.virtualMachines.deallocate(..) fails', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'deallocate').and.returnValue(Promise.reject(new Error('test error')));
    spyOn(mockedLogger, 'error');

    // WHEN
    try {
      await AzureClient.stopVm();
    } catch (err) {
    // THEN
      expect(
        mockedClient.virtualMachines.deallocate,
      ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
      expect(mockedLogger.error).toHaveBeenCalled();
    }
  });
});

describe('startVm', () => {
  it('should start the VM by calling client.virtualMachines.start(..) with the appropriate params from Fetch.getAzureCreds()', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'start');

    // WHEN
    await AzureClient.startVm();

    // THEN
    expect(
      mockedClient.virtualMachines.start,
    ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
  });

  it('should catch error if client.virtualMachines.start(..) fails', async () => {
    // GIVEN
    spyOn(mockedClient.virtualMachines, 'start').and.returnValue(Promise.reject(new Error('test error')));
    spyOn(mockedLogger, 'error');

    // WHEN
    try {
      await AzureClient.startVm();
    } catch (err) {
      // THEN
      expect(
        mockedClient.virtualMachines.start,
      ).toHaveBeenCalledWith(expectedResourceGroupName, expectedVmName);
      expect(mockedLogger.error).toHaveBeenCalled();
    }
  });
});
