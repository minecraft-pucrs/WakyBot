const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const Query = require('mcquery');

module.exports = {

  getServerInfo(ip, port = 25565) {
    const query = new Query(ip, port, { timeout: 10000 });
    return query.connect().then(() => query.full_stat((err, stat) => {
      if (err) {
        logger.error(err);
        return false;
      }
      logger.debug('Successfully fetched Minecraft Server Status');
      return stat;
    })).catch((err) => {
      logger.error(err);
      return false;
    });
  },

};
