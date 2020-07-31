const pino = require('pino');
const Discord = require('discord.js');
/* eslint-disable global-require */
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
/* eslint-disable no-new */
new (require('./client/DiscordClient').DiscordClient)(Discord, logger);
/* eslint-enable no-new */
/* eslint-enable global-require */
logger.info('Hello World!');

logger.debug('This is a DEBUG level logging');

logger.warn('This is a WARN level logging');
