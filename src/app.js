const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const yml = require('js-yaml');

const fs = require('fs');

const Discord = require('discord.js');

const fetch = new (require('./utils/Fetch').Fetch)(yml, fs, logger);

const discordClient = new (require('./client/DiscordClient').DiscordClient)(Discord, fetch, logger);

logger.info('Hello World!');

logger.debug('This is a DEBUG level logging');

logger.warn('This is a WARN level logging');