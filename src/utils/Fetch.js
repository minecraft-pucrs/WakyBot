const DISCORD_CREDS_PATH = '../config/discordcredentials.yml'

class Fetch {
    constructor(YML, fs, logger) {
        this.YML = YML;
        this.fs = fs;
        this.logger = logger;
    }

    getDiscordCreds() {
        try {
            const discordCreds = YML.safeLoad(fs.readFileSync(DISCORD_CREDS_PATH, 'utf8'));
            return discordCreds;
        } catch (e) {
                logger.error(e);
        }
    }
}

exports.Fetch = Fetch;