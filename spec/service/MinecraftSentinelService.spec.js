const proxyquire = require('proxyquire').noCallThru();

describe('Cron Schedule', () => {
  it('should execute routines using default sentinel rules', () => {
    const mockedCron = {
      schedule: () => {},
    };

    spyOn(mockedCron, 'schedule').and.callThrough();

    const mockedMcStatus = {
      getServerInfo: () => {},
    };

    const mockedFetch = {
      getSentinelRules: () => ({
        pingMaxCount: 4,
        pingIntervalInMinutes: 5,
      }),
      getMinecraftServerInfo: () => {},
    };

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    expect(mockedCron.schedule).toHaveBeenCalledWith('*/5 * * * *', jasmine.any(Function), {
      scheduled: false,
      timezone: 'America/Sao_Paulo',
    });
  });

  it('should execute routines using custom sentinel rules', () => {
    const customNoPlayersMaxCount = 20;
    const customPingIntervalInMinutes = 10;

    const mockedCron = {
      schedule: () => {},
    };
    const mcStatusInfo = () => {};
    const mockedMcStatus = {
      getServerInfo: () => new Promise((resolve) => {
        resolve(mcStatusInfo());
      }),
    };

    const mockedFetch = {
      getSentinelRules: () => ({
        pingMaxCount: customNoPlayersMaxCount,
        pingIntervalInMinutes: customPingIntervalInMinutes,
      }),
      getMinecraftServerInfo: () => {},
    };

    spyOn(mockedCron, 'schedule');

    proxyquire('../../src/service/MinecraftSentinelService',
      {
        '../../src/adapter/MinecraftServerStatusAdapter': mockedMcStatus,
        '../../src/utils/Fetch': mockedFetch,
        'node-cron': mockedCron,
      });

    expect(mockedCron.schedule).toHaveBeenCalledWith(`*/${customPingIntervalInMinutes} * * * *`, jasmine.any(Function), {
      scheduled: false,
      timezone: 'America/Sao_Paulo',
    });
  });
});
