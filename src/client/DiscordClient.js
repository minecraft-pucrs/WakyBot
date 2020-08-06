const Discord = require('discord.js');
const pino = require('pino');
const discordInfo = require('../utils/Fetch.js').getDiscordBotInfo();
const Trigger = require('../service/Triggers.js');

const client = new Discord.Client();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

client.on('ready', () => {
  logger.info('WakyBot is ready!');
});

client.on('message', (message) => {
  if (message.content === 'ServerOn') {
    logger.info(`${message.author.username} requested to turn the Server on`);
    message.channel.send('Attempting to turn on Minequack Server');

    Trigger.triggerPowerOn.then(() => {
      message.channel.send('Minequack Server is now on');
      logger.info();
    }).catch(() => {
      message.channel.send('There was a problem, try again');
    });
  }

  if (message.channel.type === 'dm' && !message.author.bot) {
    message.channel.send('To turn on the server, type ServerOn');
  }
});

module.exports = {

  sendMessageToServerConsoleChannel(message) {
    return new Promise((resolve, reject) => {
      client.channels.fetch(discordInfo.serverConsoleChannelId, true)
        .then((channel) => {
          channel.send(message);
          resolve();
        })
        .catch(() => {
          logger.error('Could not retrieve log channel ID');
          reject(new Error('Could not retrieve log channel ID'));
        });
    });
  },

  startDiscordClient() {
    let i;

    for (i = 0; i < 5; i += 1) {
      client.login(discordInfo.token).then(() => true).catch((err) => {
        logger.error('Error connecting to server. Retrying.');
        logger.error(err);
      });
    }

    logger.error('Failed to authenticate with Discord (max number of tries)');
  },

};
