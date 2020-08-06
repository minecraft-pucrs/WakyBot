<h1 align="center">
  <img src="https://http2.mlstatic.com/-dvd-anime-serial-experiments-lain-completo-D_NQ_NP_757386-MLB27696979047_072018-F.jpg" width="200" height="200" align="right" />
  <br>
  WakyBot
  <br>
</h1>
<br>

[![Azure Pipelines](https://dev.azure.com/sarahlacerda/MineQuack/_apis/build/status/Minequack.WakyBot?branchName=master)](https://dev.azure.com/sarahlacerda/MineQuack/_build/latest?definitionId=1&branchName=master)
![CI](https://github.com/Minequack/WakyBot/workflows/CI/badge.svg)

# Overview

This is a nodeJs application that acts as a Discord bot and a Minecraft server sentinel. It's able to save cloud resources by stopping a minecraft server when not in use for long hours (no players playing) and it also allows players to start up an offline server directly via Discord by asking the bot.

This application was designed specifically for Minequack, considering it's particular architecture (cloud computing resources hosted on Azure VMs, etc). However, if you feel that the some specific functionality of this application fits your needs, feel free to copy part of the code for it and use it on your project or even fork the repository to tweak the code as you wish. Or if it's the case that this project satisfies exactly what you're needing (problably not the case), feel free to use the whole application as is :grin:

![Here is a brief overview summary of the overall application architecture](https://github.com/Minequack/WakyBot/raw/master/architecture_summary.pdf)

# Installation

This bot is written to run on top of node.js. Please see https://nodejs.org/en/download/

Once you have NodeJS installed, running `npm install` from the bot directory should install all required packages!

# Configuration

This bot makes use of Environment variables to set its configuration. Here is a mapping of what each of these variables mean. All the variables marked as required are *needed* for the application to work:

| Environment Variable Name            | Description                                             | Required |
|--------------------------------------|---------------------------------------------------------|----------|
|$AZURE_SUBSCRIPTION_ID                | Unique id that identifies your Azure subscription *     |   YES    |
|$AZURE_RESOURCE_GROUP_NAME            | Resource Group where the Minecraft server VM is located*|   YES    |
|$AZURE_VM_NAME                        | Name of the VM where the Minecraft server is running *  |   YES    |
|$AZURE_CLIENT_ID                      | Generated when creating a service principal in AD *     |   YES    |
|$AZURE_APPLICATION_SECRET             | Azure application secret, can also be found in AD *     |   YES    |
|$AZURE_DOMAIN                         | Azure Active Directory Donain *                         |   YES    |
|$DISCORD_BOT_TOKEN                    | The auth token to control a Discord Bot                 |   YES    |
|$DISCORD_CONSOLE_CHANNEL_ID           | channelID of channel that responds to MC server console |   YES    |
|$MINECRAFT_SERVER_HOST                | The Minecraft server IP address                         |   YES    |
|$MINECRAFT_SERVER_PORT                | The Minecraft server port. Defaults to 25565 if blank   |   NO     |
|$MINECRAFT_PING_COUNT_HOW_MANY_TIMES  | ![See Minecraft Server Sentinel](#mcSentinel)           |   NO     |
|$MINECRAFT_PING_INTERVAL_IN_MINUTES   | [See Minecraft Server Sentinel](#mcSentinel)            |   NO     |
|$MINECRAFT_SENTINEL_SERVICE_ENABLED   | Flag that defines if Sentinel service will be enabled   |   NO     |


### <a name="mcSentinel"></a>Minecraft Sentinel

One of the functionalities of this application is called Minecraft Sentinel. Its purpose is to be able to identify when the minecraft server is idle for long periods of times (no players are playing for long hours) and prevent waste of cloud resources by shuting down the minecraft server. If someone wants to play after the server goes offline, they can ask this application via the Discord bot client to start the server back again.

The way the Minecraft Sentinel works is by executing a cron job evey now and then to ping the server and query how many players are online at that time. If the server is up and no players are playing, a counter is incremented, if at least one player is playing during one of the queries, this counter gets reset back to 0.
If the counter reaches a certain limit, a server shutdown will be trigger.

The limit for the counter and the frequency in which the cron job pings the server is customizeable via 2 environment variables, and if no value is specified and the Minecraft Sentinel is enabled, a default value will be used to each of them:

`$MINECRAFT_PING_INTERVAL_IN_MINUTES`: This variable will set the frequency (in minutes) in which the cron job will be executed. If left blank, it will default to 5 minutes.

`$MINECRAFT_PING_INTERVAL_IN_MINUTES`: This variable will set the limit of the counter. If the counter ever increments to reach this specified limit, the server will shut down. If left blank, it will default to 4

`$MINECRAFT_SENTINEL_SERVICE_ENABLED`: This variable expects a value of either true or false and will define whether the Sentinel Service will be enabled or not. If left blank, it will default to false. In other words, the Sentinel Service will not be enabled 

# License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

Waky's avatar is from the main character of "Serial Experiments Lain", a 1998 Japanese anime television series produced by Yasuyuki Ueda and animated by Triangle Staff.
