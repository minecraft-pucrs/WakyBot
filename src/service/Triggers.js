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

  async validatePowerOnAttempt() {
    const serverInfo = await getServerInfo();

    if (serverInfo !== undefined) {
      throw new Error('The server is already up and running');
    } else {
      let vmRunning;
      try {
        const vmStatus = await AzureClient.getVmStatus();
        if (vmStatus.toLowerCase().includes('running')) {
          vmRunning = true;
        } else {
          vmRunning = false;
        }
      } catch {
        vmRunning = false;
      }
      if (vmRunning) {
        throw new Error('Internal Error: The server appears to be down but the virtual machine appears to be running');
      }
    }
    return true;
  },

  async triggerPowerOn() {
    let result;
    try {
      result = await AzureClient.startVm();
    } catch {
      throw new Error('Error while comunicating with AzureClient');
    }
    return result;
  },

  async triggerPowerOff() {
    const serverInfo = await getServerInfo();

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
