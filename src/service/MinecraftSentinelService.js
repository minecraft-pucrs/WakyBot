const pino = require('pino');
const cron = require('node-cron');
const sentinelRules = require('../utils/Fetch').getSentinelRules();
const minecraftServerInfo = require('../utils/Fetch').getMinecraftServerInfo();
const mcStatus = require('../adapter/MinecraftServerStatusAdapter');
const discordClient = require('../client/DiscordClient');
const triggers = require('./Triggers');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const noPlayersMaxCount = typeof sentinelRules.pingMaxCount !== 'undefined' ? sentinelRules.pingMaxCount : 4;
const pingIntervalInMinutes = typeof sentinelRules.pingIntervalInMinutes !== 'undefined' ? sentinelRules.pingIntervalInMinutes : 5;

let noPlayersCount = 0;

/* Routine: Pings Minecraft server for player activity
    If no players are connected for a set quantity of routine checks, a server shutdown
    and VM deallocation will be triggered to save resources.

    RULES:
    @param noPlayersMaxCount: Defines how many routine checks will be executed until
    a server shut down can be triggered. No players can be online.
    If at least one player is online during one of the routine checks, the counter is
    reset back to 0. If no value is defined, defaults to 4;

    @param pingIntervalInMinutes: Defines the frequency (in minutes) in which the routine
    checks should be executed. If no value is defined, defaults to 5;
*/
async function task() {
  let serverInfo;
  try {
    serverInfo = await mcStatus.getServerInfo(minecraftServerInfo.host, minecraftServerInfo.port);
  } catch {
    logger.error('Unable to receive server info from MinecraftServerStatusAdapter, sentinel routine will not run');
  }
  if (serverInfo !== null) {
    logger.debug('Starting sentinel routine to detect player activity on Minecraft server...');
    if (serverInfo.numplayers === 0) {
      noPlayersCount += 1;
      logger.debug(`Sentinel: There are no players online, inactivity counter has been incremented to ${noPlayersCount}`);
    } else {
      logger.debug('Sentinel: There are players online, inactivity counter set to 0');
      noPlayersCount = 0;
    }
    if (noPlayersCount == noPlayersMaxCount) {
      logger.info('Sentinel: Inactivity counter has reached the limit. Triggering auto-shutdown and deallocation of Minecraft server...');
      noPlayersCount = 0;
      try {
        await discordClient.sendMessageToServerConsoleChannel('stop');

        // Wait 1 minute so the server has time to properly shutdown
        setTimeout(triggers.triggerPowerOff, 100000);
      } catch (err) {
        logger.error(`Unable to auto shutdown - ${err}`);
      }
    }
  } else {
    noPlayersCount = 0;
  }
}

const routine = cron.schedule(`*/${pingIntervalInMinutes} * * * *`, task, {
  scheduled: false,
  timezone: 'America/Sao_Paulo',
});

exports.task = task;
exports.routine = routine;
