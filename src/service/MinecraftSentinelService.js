const pino = require('pino');
const cron = require('node-cron');
const sentinelRules = require('../utils/Fetch').getSentinelRules();
const minecraftServerInfo = require('../utils/Fetch').getMinecraftServerInfo();
const mcStatus = require('../adapter/MinecraftServerStatusAdapter');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const noPlayersMaxCount = typeof sentinelRules.pingMaxCount !== 'undefined' ? sentinelRules.pingMaxCount : 5;
const pingIntervalInMinutes = typeof sentinelRules.pingIntervalInMinutes !== 'undefined' ? sentinelRules.pingIntervalInMinutes : 2;

let noPlayersCount = 0;

cron.schedule(`* */${pingIntervalInMinutes} * * *`, async () => {
  let serverInfo;
  try {
    serverInfo = await mcStatus.info(minecraftServerInfo.host, minecraftServerInfo.port);
  } catch {
    serverInfo = undefined;
  }
  if (serverInfo !== undefined) {
    /* Routine: Pings Minecraft server for player activity
         If no players are connected for a set quantity of routine checks, a server shutdown
         and VM deallocation will be triggered to save resources.

         RULES:
         @param noPlayersMaxCount: Defines how many routine checks will be executed until
         a server shut down can be triggered. No players can be online.
         If at least one player is online during one of the routine checks, the counter is
         reset back to 0. If no value is defined, defaults to 5;

         @param pingIntervalInMinutes: Defines the frequency (in minutes) in which the routine
         checks should be executed. If no value is defined, defaults to 2;
    */
    logger.debug('Starting sentinel routine to detect player activity on Minecraft server...');
    if (!serverInfo.online) {
      noPlayersCount = 0;
      logger.debug('Sentinel: Server is not online! Routine was aborted!');
      return;
    }
    if (serverInfo.players.now === 0) {
      noPlayersCount += 1;
      logger.debug(`Sentinel: There are no players online, inactivity counter has been incremented to ${noPlayersCount}`);
    } else {
      logger.debug('Sentinel: There are players online, inactivity counter will be set back to 0');
      noPlayersCount = 0;
    }
    if (noPlayersCount === noPlayersMaxCount) {
      logger.info('Sentinel: Inactivity counter has reached the limit. Triggering auto-shutdown and deallocation of Minecraft server...');
      // Time to shut down!
      noPlayersCount = 0;
      // update status from another call later
    }
  }
});

module.exports = {

  updateServerStatus() {
    noPlayersCount = 0;
  },

};
