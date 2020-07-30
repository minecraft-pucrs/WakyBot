const pino = require('pino');
const yml = require('js-yaml');
const fs = require('fs');
const Discord = require('discord.js');
/* eslint-disable global-require */
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const fetch = new (require('./utils/Fetch').Fetch)(yml, fs, logger);
/* eslint-disable no-new */
new (require('./client/DiscordClient').DiscordClient)(Discord, fetch, logger);
/* eslint-enable no-new */
/* eslint-enable global-require */
logger.info('Hello World!');

logger.debug('This is a DEBUG level logging');

logger.warn('This is a WARN level logging');
