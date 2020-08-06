const Fetch = require('../utils/Fetch');
const MinecraftServerStatusAdapter = require('../adapter/MinecraftServerStatusAdapter');
const AzureClient = require('../client/AzureClient');
const DiscordClient = require('../client/DiscordClient');

function getServerInfo() {
  return MinecraftServerStatusAdapter.getServerInfo(
    Fetch.getMinecraftServerInfo().host,
    Fetch.getMinecraftServerInfo().port,
  );
}

module.exports = {

  async triggerPowerOn() {
    let vmRunning;
    try {
      if (AzureClient.getVmStatus().includes('Running')) {
        vmRunning = true;
      } else {
        vmRunning = false;
      }
    } catch {
      vmRunning = false;
    }
    if (vmRunning) {
      let serverInfo;
      try {
        serverInfo = await getServerInfo();
      } catch (err) {
        throw new Error('Unable to get info whether Minecraft Server is already on or not');
      }
      if (serverInfo !== undefined) {
        throw new Error('The server is already up and running');
      } else {
        throw new Error('Internal Error: The server appears to be down but the virtual machine appears to be running');
      }
    }

    let result;
    try {
      result = await AzureClient.startVm();
    } catch {
      throw new Error('Error while comunicating with AzureClient');
    }
    return result;
  },

  async triggerPowerOff() {
    try {
      await DiscordClient.sendMessageToServerConsoleChannel('Stop');
    } catch (err) {
      throw new Error('Cannot trigger stop on Discord Server Console Channel');
    }

    let serverInfo;
    try {
      serverInfo = await getServerInfo();
    } catch (err) {
      throw new Error('Cannot safely proceed with shutdown: Unable to get info whether Minecraft Server is already off or not');
    }

    if (serverInfo != undefined) {
      throw new Error('Minecraft server is still online even after stop trigger. Cannot force machine to shut down');
    }
    let result;
    try {
      result = await AzureClient.stopVm();
    } catch {
      throw new Error('Error while comunicating with AzureClient');
    }
    return result;
  },
};
