const request = require('request');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

let url;

module.exports = {

  getServerInfo(ip, port = 25565) {
    logger.info('Fetching Minecraft Server Status...');
    return new Promise((resolve, reject) => {
      url = `https://mcapi.us/server/status?ip=${ip}&port=${port}`;
      request(url, { json: true }, (err, res, body) => {
        if (err) {
          logger.error(`Error while fetching Minecraft Server Status ${err}`);
          reject(err);
        }
        logger.info('Successfully fetched Minecraft Server Status');
        resolve(body);
      });
    });
  },
};
