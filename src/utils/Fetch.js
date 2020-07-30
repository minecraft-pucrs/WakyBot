const DISCORD_CREDS_PATH = '../../discordcredentials.yml';

class Fetch {
  constructor(YML, fs, logger) {
    this.YML = YML;
    this.fs = fs;
    this.logger = logger;
  }

  getDiscordCreds() {
    try {
      const discordCreds = this.YML.safeLoad(this.fs.readFileSync(DISCORD_CREDS_PATH, 'utf8'));
      return discordCreds;
    } catch (e) {
      this.logger.error(e);
    }
    return undefined;
  }
}

exports.Fetch = Fetch;
