const proxyquire = require('proxyquire');

describe('Cron Schedule', () => {
  it('should execute routines using default sentinel rules', () => {
    const mockedCron = {
      schedule: (str, fun) => {
        for (let i = 0; i < 5; i += 1) {
          fun();
        }
      },
    };
    const mcStatusInfo = () => ({
      online: true,
      players: { now: 0 },
    });
    const mockedMcStatus = {
      info: () => new Promise((resolve) => {
        resolve(mcStatusInfo());
      }),
    };
    spyOn(mockedCron, 'schedule');
    // spyOn(someIntegrationServiceMock, 'functionToTriggerShutdown');
    const mockedFetch = {};

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    expect(mockedCron.schedule).toHaveBeenCalledWith('* */2 * * *', jasmine.any(Function));
    // expect(someIntegrationService.functionToTriggerShutdown).toHaveBeenCalledTimes(1);
  });

  it('should execute routines using custom sentinel rules', () => {
    const customNoPlayersMaxCount = 20;
    const customPingIntervalInMinutes = 10;

    const mockedCron = {
      schedule: (str, fun) => {
        for (let i = 0; i < customNoPlayersMaxCount; i += 1) {
          fun();
        }
      },
    };
    const mcStatusInfo = () => ({
      online: true,
      players: { now: 0 },
    });
    const mockedMcStatus = {
      info: () => new Promise((resolve) => {
        resolve(mcStatusInfo());
      }),
    };

    const mockedFetch = {
      getSentinelRules: () => ({
        pingMaxCount: customNoPlayersMaxCount,
        pingIntervalInMinutes: customPingIntervalInMinutes,
      }),
    };

    spyOn(mockedCron, 'schedule');
    // spyOn(someIntegrationServiceMock, 'functionToTriggerShutdown');

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    expect(mockedCron.schedule).toHaveBeenCalledWith(`* */${customPingIntervalInMinutes} * * *`, jasmine.any(Function));
    // expect(someIntegrationService.functionToTriggerShutdown).toHaveBeenCalledTimes(1);
  });

  it('if serverInfo is undefined, do not run routine', () => {
    const mockedCron = {
      schedule: () => {},
    };
    const mockedMcStatus = {
      info: () => {},
    };
    // spyOn(someIntegrationServiceMock, 'functionToTriggerShutdown');
    const mockedFetch = {};

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    // expect(someIntegrationService.functionToTriggerShutdown).toHaveBeenCalledTimes(0);
  });

  it('if server is off, do not run routine', async () => {
    const mcStatusInfo = () => ({
      online: false,
      players: { now: 0 },
    });
    const mockedMcStatus = {
      info: () => new Promise((resolve) => {
        resolve(mcStatusInfo());
      }),
    };
    const mockedCron = {
      schedule: () => {},
    };
    const mockedFetch = {};

    // spyOn(someIntegrationServiceMock, 'functionToTriggerShutdown');

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    // expect(someIntegrationService.functionToTriggerShutdown).toHaveBeenCalledTimes(0);
  });
});
