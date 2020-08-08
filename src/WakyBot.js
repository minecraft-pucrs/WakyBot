const pino = require('pino');
const Fetch = require('./utils/Fetch');
const DiscordClient = require('./client/DiscordClient');
const sentinelService = require('./service/MinecraftSentinelService');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

logger.info('Waky Waky! My name is WakyBot!');
logger.info('I am starting things up, one second...');

const vars = {
  AZURE_SUBSCRIPTION_ID: typeof Fetch.getAzureCreds().subrscriptionId !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  AZURE_RESOURCE_GROUP_NAME: typeof Fetch.getAzureCreds().resourceGroupName !== 'undefined' ? Fetch.getAzureCreds().resourceGroupNam : 'UNDEFINED',
  AZURE_VM_NAME: typeof Fetch.getAzureCreds().vmName !== 'undefined' ? Fetch.getAzureCreds.vmName : 'UNDEFINED',
  AZURE_CLIENT_ID: typeof Fetch.getAzureCreds().clientId !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  AZURE_APPLICATION_SECRET: typeof Fetch.getAzureCreds().secret !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  AZURE_DOMAIN: typeof Fetch.getAzureCreds().domain !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  DISCORD_CHAT_BOT_TOKEN: typeof Fetch.getDiscordBotInfo().chatBotToken !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  DISCORD_CONSOLE_BOT_TOKEN: typeof Fetch.getDiscordBotInfo().consoleBotToken !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  DISCORD_CONSOLE_CHANNEL_ID: typeof Fetch.getDiscordBotInfo().serverConsoleChannelId !== 'undefined' ? 'DEFINED/**Secret**' : 'UNDEFINED',
  MINECRAFT_SERVER_HOST: typeof Fetch.getMinecraftServerInfo().host !== 'undefined' ? Fetch.getMinecraftServerInfo().host : 'UNDEFINED',
  MINECRAFT_SERVER_PORT: typeof Fetch.getMinecraftServerInfo().port !== 'undefined' ? Fetch.getMinecraftServerInfo().port : 'UNDEFINED, 25565 will be used as default',
  MINECRAFT_PING_COUNT_MANY_TIMES: typeof Fetch.getSentinelRules().pingMaxCount !== 'undefined' ? Fetch.getSentinelRules().pingMaxCount : 'UNDEFINED, default value will be used',
  MINECRAFT_PING_INTERVAL_IN_MINUTES: typeof Fetch.getSentinelRules().pingIntervalInMinutes !== 'undefined' ? Fetch.getSentinelRules().pingIntervalInMinutes : 'UNDEFINED, default value will be used',
  MINECRAFT_SENTINEL_SERVICE_ENABLED: typeof Fetch.getSentinelRules().sentinelEnabled !== 'undefined' ? Fetch.getSentinelRules().sentinelEnabled : 'UNDEFINED, default value will be used',
};

logger.info('These are the environment variables loaded in:');

Object.keys(vars).forEach((key) => {
  if (vars[key] !== undefined && vars[key].includes('UNDEFINED')) {
    if (vars[key].includes('default')) {
      logger.warn(`$${key} : ${vars[key]}`);
    } else {
      logger.error(`$${key} : ${vars[key]}`);
    }
  } else {
    logger.info(`$${key} : ${vars[key]}`);
  }
});

if (Fetch.getSentinelRules().sentinelEnabled !== undefined && Fetch.getSentinelRules().sentinelEnabled.toLowerCase() == 'true') {
  logger.info('Loading MinecraftSentinelService...');
  sentinelService.routine.start();
  logger.info('MinecraftSentinelService is loaded and enabled!');
}

logger.info('Starting discord client...');
DiscordClient.startDiscordClient();
