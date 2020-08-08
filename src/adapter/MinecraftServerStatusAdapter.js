const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const Query = require('mcquery');

let result;

module.exports = {

  async getServerInfo(ip, port = 25565) {
    logger.debug('Attempting to query minecraft server...');
    const query = new Query(ip, port, { timeout: 10000 });

    try {
      await query.connect();
      await query.basic_stat((err, stat) => {
        if (err) {
          result = null;
          logger.debug(`${err} - Probably because the server is offline`);
        }
        logger.debug('Successfuly queried minecraft server!');
        if (query.outstandingRequests === 0) {
          query.close();
        }
        result = stat;
      });
    } catch (err) {
      result = null;
      logger.debug(`${err} - Probably because the server is offline`);
    }

    return result;
  },

};
