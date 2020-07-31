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
  getDiscordBotToken() { return process.env.DISCORD_BOT_TOKEN; },
};
