module.exports = {
  getAzureCreds() {
    return {
      subrscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
      resourceGroupName: process.env.AZURE_RESOURCE_GROUP_NAME,
      vmName: process.env.AZURE_VM_NAME,
      clientId: process.env.AZURE_CLIENT_ID,
      secret: process.env.AZURE_APPLICATION_SECRET,
      domain: process.env.AZURE_DOMAIN,
    };
  },

  getDiscordBotInfo() {
    return {
      token: process.env.DISCORD_BOT_TOKEN,
      serverConsoleChannelId: process.env.DISCORD_LOG_CHANNEL_ID,
    };
  },

  getMinecraftServerInfo() {
    return {
      host: process.env.MINECRAFT_SERVER_HOST,
      port: process.env.MINECRAFT_SERVER_PORT,
    };
  },

  getSentinelRules() {
    return {
      pingMaxCount: process.env.MINECRAFT_PING_COUNT_MANY_TIMES,
      pingIntervalInMinutes: process.env.MINECRAFT_PING_INTERVAL_IN_MINUTES,
    };
  },
};
