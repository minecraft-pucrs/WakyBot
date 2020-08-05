const proxyquire = require('proxyquire').noCallThru();

let mockedMcSSAdapter;
let mockedAzureClient;

let Triggers;

beforeEach(() => {
  mockedMcSSAdapter = {
    getServerInfo: () => {},
  };

  mockedAzureClient = {
    getVmStatus: () => {},
    startVm: () => {},
    stopVm: () => {},
  };

  Triggers = proxyquire('../../src/service/Triggers',
    {
      '../client/AzureClient': mockedAzureClient,
      '../adapter/MinecraftServerStatusAdapter': mockedMcSSAdapter,
    });
});

describe('triggerPowerOn', () => {
  it('should throw error if is unable to fetch server info', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.throwError(new Error());

    const expectedErr = 'Error: Unable to get info whether Minecraft Server is already on or not';
    let resultErr;
    try {
      await Triggers.triggerPowerOn();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });

  it('should throw error if server is already online', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'true' });

    const expectedErr = 'Error: The server is already up and running';
    let resultErr;

    try {
      await Triggers.triggerPowerOn();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });

  it('should throw error if the server is down but the vm is up', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'false' });

    const expectedErr = 'Error: Internal Error: The server appears to be down but the virtual machine appears to be running';
    let resultErr;

    try {
      await Triggers.triggerPowerOn();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });

  it('should throw error if unable to get a response from AzureClient', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue(Promise.resolve('Deallocated'));
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'false' });
    spyOn(mockedAzureClient, 'startVm').and.returnValue(undefined);

    const expectedErr = 'Error: Error while comunicating with AzureClient';
    let resultErr;

    try {
      await Triggers.triggerPowerOn();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
  });

  it('should execute all the expected steps and return a result if successful', async () => {
    const expectedReturnValue = 'ok';

    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue(Promise.resolve('Deallocated'));
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'false' });
    spyOn(mockedAzureClient, 'startVm').and.returnValue(expectedReturnValue);

    const result = await Triggers.triggerPowerOn();

    expect(result).toEqual(expectedReturnValue);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(1);
  });
});

describe('triggerPowerOff', () => {
  it('should throw error if unable to execute stop command via discord', () => {
    // TODO
  });

  it('should throw error if unable to get minecraft server info', () => {
    // TODO
  });

  it('should throw error if minecraft server is still online after stop call', async () => {
    // TODO
  });

  it('should throw error if unable to get a response from AzureClient', async () => {
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'false' });
    spyOn(mockedAzureClient, 'stopVm').and.returnValue(undefined);

    const expectedErr = 'Error: Error while comunicating with AzureClient';
    let resultErr;

    try {
      await Triggers.triggerPowerOff();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
  });

  // TO FIX:
  xit('should execute all the expected steps and return a result if successful', async () => {
    const expectedReturnValue = 'ok';

    spyOn(mockedAzureClient, 'stopVm').and.returnValue(expectedReturnValue);
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue(Promise.resolve('Running'));
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'false' });

    const result = await Triggers.triggerPowerOn();

    expect(result).toEqual(expectedReturnValue);
    expect(mockedAzureClient.stopVm).toHaveBeenCalledTimes(1);
  });
});
