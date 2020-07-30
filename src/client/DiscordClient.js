class DiscordClient {
  constructor(discord, fetch, logger) {
    this.discord = discord;
    this.fetch = fetch;
    this.logger = logger;
  }
}

exports.DiscordClient = DiscordClient;
