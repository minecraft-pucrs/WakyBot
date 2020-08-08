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
  it('should throw error if unable to get a response from AzureClient', async () => {
    const expectedErr = 'Error: Error while comunicating with AzureClient';
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue(Promise.resolve('Deallocated'));
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue(undefined);
    spyOn(mockedAzureClient, 'startVm').and.throwError(expectedErr);

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
    spyOn(mockedAzureClient, 'startVm').and.returnValue(expectedReturnValue);

    const result = await Triggers.triggerPowerOn();

    expect(result).toEqual(expectedReturnValue);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(1);
  });
});

describe('triggerPowerOff', () => {
  it('should throw error if unable to execute stop command via discord', async () => {
    const expectedError = 'Error: Cannot trigger stop on Discord Server Console Channel';

    spyOn(mockedDiscordClient, 'sendMessageToServerConsoleChannel').and.throwError(expectedError);

    let resultError;
    try {
      await Triggers.triggerPowerOff();
    } catch (error) {
      resultError = error.toString();
    }

    expect(resultError).toEqual(expectedError);
  });

  it('should throw error if unable to get minecraft server info', async () => {
    const expectedError = 'Error: Cannot safely proceed with shutdown: Unable to get info whether Minecraft Server is already off or not';

    spyOn(mockedDiscordClient, 'sendMessageToServerConsoleChannel').and.returnValue(undefined);
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.throwError();

    let resultError;
    try {
      await Triggers.triggerPowerOff();
    } catch (error) {
      resultError = error.toString();
    }

    expect(resultError).toEqual(expectedError);

  });

  it('should throw error if minecraft server is still online after stop call', async () => {
    const expectedError = 'Error: Minecraft server is still online even after stop trigger. Cannot force machine to shut down';

    spyOn(mockedDiscordClient, 'sendMessageToServerConsoleChannel').and.returnValue(undefined);
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue('Server Online');

    let resultError;
    try {
      await Triggers.triggerPowerOff();
    } catch (error) {
      resultError = error.toString();
    }

    expect(resultError).toEqual(expectedError);
  });

  it('should throw error if unable to get a response from AzureClient', async () => {
    const expectedErr = 'Error: Error while comunicating with AzureClient';
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue(undefined);
    spyOn(mockedAzureClient, 'stopVm').and.throwError(new Error(expectedErr));

    let resultErr;
    try {
      await Triggers.triggerPowerOff();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
  });

  it('should execute all the expected steps and return a result if successful', async () => {
    const expectedReturnValue = 'ok';

    spyOn(mockedAzureClient, 'stopVm').and.returnValue(expectedReturnValue);
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue(Promise.resolve('Deallocated'));
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue(undefined);

    const result = await Triggers.triggerPowerOff();

    expect(result).toEqual(expectedReturnValue);
    expect(mockedAzureClient.stopVm).toHaveBeenCalledTimes(1);
  });
});

describe('validatePowerOnAttempt', () => {
  it('should throw error if server is already online', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue({ online: 'true' });

    const expectedErr = 'Error: The server is already up and running';
    let resultErr;

    try {
      await Triggers.validatePowerOnAttempt();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });

  it('should throw error if the server is down but the vm is up', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.returnValue(undefined);

    const expectedErr = 'Error: Internal Error: The server appears to be down but the virtual machine appears to be running';
    let resultErr;

    try {
      await Triggers.validatePowerOnAttempt();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr.toString()).toEqual(expectedErr);
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });

  it('should throw error if is unable to fetch server info', async () => {
    spyOn(mockedAzureClient, 'getVmStatus').and.returnValue('Running');
    spyOn(mockedAzureClient, 'startVm');
    spyOn(mockedMcSSAdapter, 'getServerInfo').and.throwError(new Error());

    let resultErr;
    try {
      await Triggers.validatePowerOnAttempt();
    } catch (err) {
      resultErr = err;
    }

    expect(resultErr).toBeDefined();
    expect(mockedAzureClient.startVm).toHaveBeenCalledTimes(0);
  });
});
