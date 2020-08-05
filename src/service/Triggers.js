const Fetch = require('../utils/Fetch');
const MinecraftServerStatusAdapter = require('../adapter/MinecraftServerStatusAdapter');
const AzureClient = require('../client/AzureClient');

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
      if (serverInfo.online == 'true') {
        throw new Error('The server is already up and running');
      } else {
        throw new Error('Internal Error: The server appears to be down but the virtual machine appears to be running');
      }
    }

    const result = await AzureClient.startVm();
    if (result === undefined) {
      throw new Error('Error while comunicating with AzureClient');
    }
    return result;
  },

  async triggerPowerOff() {
    // BEFORE Anything SHUTDOWN: TRIGGER DISCORD STOP ON CONSOLE CHANNEL!
    // IF NO ERROR -> PROCEED EXECUTION

    let serverInfo;
    try {
      serverInfo = await getServerInfo();
      if (serverInfo === undefined || serverInfo.status == 'error') {
        throw new Error();
      }
    } catch (err) {
      throw new Error('Cannot safely proceed with shutdown: Unable to get info whether Minecraft Server is already off or not');
    }

    if (serverInfo.online == 'true') {
      throw new Error('Minecraft server is still online, even after stop trigger. Cannot force machine to shut down');
    }

    const result = await AzureClient.stopVm();
    if (result === undefined) {
      throw new Error('Error while comunicating with AzureClient');
    }
    return result;
  },
};
