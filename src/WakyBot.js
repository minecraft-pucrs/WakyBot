const pino = require('pino');
const Fetch = require('./utils/Fetch');
// const DiscordClient = require('./client/DiscordClient');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

logger.info('Waky Waky! My name is WakyBot!');
logger.info('I am starting things up, one second...');

const azureVars = {
  AZURE_SUBSCRIPTION_ID: typeof Fetch.getAzureCreds().subrscriptionId !== 'undefined' ? 'DEFINED -> **Secret**' : undefined,
  AZURE_RESOURCE_GROUP_NAME: Fetch.getAzureCreds().resourceGroupName,
  AZURE_VM_NAME: Fetch.getAzureCreds().vmName,
  AZURE_CLIENT_ID: typeof Fetch.getAzureCreds().clientId !== 'undefined' ? 'DEFINED -> **Secret**' : 'UNDEFINED',
  AZURE_APPLICATION_SECRET: typeof Fetch.getAzureCreds().secret !== 'undefined' ? 'DEFINED -> **Secret**' : 'UNDEFINED',
  AZURE_DOMAIN: typeof Fetch.getAzureCreds().domain !== 'undefined' ? 'DEFINED -> **Secret**' : 'UNDEFINED',
};
const discordVars = {
  DISCORD_BOT_TOKEN: typeof Fetch.getDiscordBotToken() !== 'undefined' ? 'DEFINED -> **Secret**' : 'UNDEFINED',
};
const minecraftVars = {
  MINECRAFT_SERVER_HOST: typeof Fetch.getMinecraftServerInfo().host !== 'undefined' ? Fetch.getMinecraftServerInfo().host : 'UNDEFINED',
  MINECRAFT_SERVER_PORT: typeof Fetch.getMinecraftServerInfo().port !== 'undefined' ? Fetch.getMinecraftServerInfo().port : 'UNDEFINED, 25565 will be used as default',
  MINECRAFT_PING_COUNT_MANY_TIMES: typeof Fetch.getSentinelRules().pingMaxCount !== 'undefined' ? Fetch.getSentinelRules().pingMaxCount : 'UNDEFINED, default value will be used',
  MINECRAFT_PING_INTERVAL_IN_MINUTES: typeof Fetch.getSentinelRules().pingIntervalInMinutes !== 'undefined' ? Fetch.getSentinelRules().pingIntervalInMinutes : 'UNDEFINED, default value will be used',
};
logger.info('These are the environment variables loaded in:');
logger.info(`Azure: ${JSON.stringify(azureVars)}`);
logger.info(`Discord: ${JSON.stringify(discordVars)}`);
logger.info(`Minecraft: ${JSON.stringify(minecraftVars)}`);

logger.info('Loading MinecraftSentinelService...');
require('./service/MinecraftSentinelService').routine.start();

logger.info('Starting discord client...');
// discord start function here
