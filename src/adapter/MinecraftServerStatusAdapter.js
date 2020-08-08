const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const Query = require('mcquery');

let result;

module.exports = {

  getServerInfo(ip, port = 25565) {
    logger.debug('Attempting to query minecraft server...');
    const query = new Query(ip, port, { timeout: 10000 });

    query.connect()
      .then(() => {
        query.basic_stat((err, stat) => {
          if (err) {
            logger.debug(`${err} - Probably because the server is offline`);
            result = undefined;
          }
          logger.debug('Successfuly queried minecraft server!');
          if (query.outstandingRequests === 0) {
            query.close();
          }
          result = stat;
        });
      })
      .catch((err) => {
        logger.debug(`${err} - Probably because the server is offline`);
        result = undefined;
      });

    return result;
  },

};
