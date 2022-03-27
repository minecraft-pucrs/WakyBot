const pino = require('pino');
const Discord = require('discord.js');
const discordInfo = require('../utils/Fetch.js').getDiscordBotInfo();
const Triggers = require('../service/Triggers.js');
const discordMessages = require('./DiscordMessages');

const chatBotClient = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});
const consoleBotClient = new Discord.Client({
  intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES],
});

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

chatBotClient.on('ready', () => {
  logger.info('Discord client for chat is ready to take requests!');
});

chatBotClient.on('ready', () => {
  logger.info('Discord client for server console is ready to take requests!');
});

chatBotClient.on('message', (message) => {
  if (message.channel.type === 'dm' && !message.author.bot) {
    message.channel.send('If you want to play Minecraft but the server is offline, go to the **game-chat** channel and type "Play" and I will take care of that :wink:');
  } else if (message.content.toUpperCase().includes('PLAY') && message.channelId == '957495953957482526' && !message.author.bot) {
    Triggers.validatePowerOnAttempt().then(() => {
      logger.info(`${message.author.username} requested to start the Minecraft server`);

      const messageBody = discordMessages.getAStartMessage()(message.author.id);

      message.channel.send(messageBody.msg);

      Triggers.triggerPowerOn()
        .then()
        .catch((err) => {
          logger.error(err);

          const failureMsgBody = discordMessages.getAFailureMessage()();

          message.channel.send(failureMsgBody.msg);
        });
    }).catch((err) => {
      logger.error(err);

      if (err.toString().toLowerCase().includes('the server is already up and running')) {
        const shouldRandomlyNotifyThatSrvIsOn = Math.random() >= 0.8;

        if (shouldRandomlyNotifyThatSrvIsOn) {
          const serverAlreadyOnline = discordMessages.getAnAlreadyOnMessage()();

          message.channel.send(serverAlreadyOnline.msg);
          message.channel.send(serverAlreadyOnline.gifUrl);
        }
      } else {
        const failureMsgBody = discordMessages.getAFailureMessage()();

        message.channel.send(failureMsgBody.msg);
      }
    });
  }
});

module.exports = {

  sendMessageToServerConsoleChannel(message) {
    return new Promise((resolve, reject) => {
      consoleBotClient.channels.fetch(discordInfo.serverConsoleChannelId, true)
        .then((channel) => {
          channel.send(message).then(() => {
            resolve();
          }).catch(
            (err) => {
              logger.error(`Could not send message to console channel - ${err}`);
              reject(new Error(`Could not send message to console channel - ${err}`));
            },
          );
        }).catch((err) => {
          logger.error(err);
          reject(err);
        });
    });
  },

  startDiscordClient() {
    chatBotClient.login(discordInfo.chatBotToken)
      .then()
      .catch((err) => {
        logger.error(`Error connecting to Discord: ${err}`);
      });

    consoleBotClient.login(discordInfo.consoleBotToken)
      .then()
      .catch((err) => {
        logger.error(`Error connecting to Discord: ${err}`);
      });
  },
};
