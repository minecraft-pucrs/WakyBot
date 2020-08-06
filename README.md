<h1 align="center">
  <br>
  <img src="https://http2.mlstatic.com/-dvd-anime-serial-experiments-lain-completo-D_NQ_NP_757386-MLB27696979047_072018-F.jpg" width="200" height="200" align="right" />
  <br>
  WakyBot
  <br>
</h1>
<br>

[![Azure Pipelines](https://dev.azure.com/sarahlacerda/MineQuack/_apis/build/status/Minequack.WakyBot?branchName=master)](https://dev.azure.com/sarahlacerda/MineQuack/_build/latest?definitionId=1&branchName=master)
![CI](https://github.com/Minequack/WakyBot/workflows/CI/badge.svg)

# Overview

A nodeJs application that acts as a Discord Bot and a Minecraft server sentinel. It's able to save resources by stopping servers when not in use and it also allows players to start up an offline server directly via Discord.

This application was designed specifically for Minequack, considering it's particular arquitecture (clould computing resources hosted on Azure VMs, etc).

TODO: Add hows

# Installation

This bot is written to run on top of node.js. Please see https://nodejs.org/en/download/

Once you have NodeJS installed, running `npm install` from the bot directory should install all required packages!

# Configuration

This bot makes use of Environment variables to set its configuration. Here is a mapping of what each of these variables mean. All the variables marked as requires are *needed* for the application to work:

| Environment Variable Name            | Description                                          |   |   |   |
|--------------------------------------|------------------------------------------------------|---|---|---|
|$AZURE_SUBSCRIPTION_ID                |                                                      |   |   |   |
|$AZURE_RESOURCE_GROUP_NAME            |                                                      |   |   |   |
|$AZURE_VM_NAME                        |                                                      |   |   |   |
|$AZURE_CLIENT_ID                      |                                                      |   |   |   |
|$AZURE_APPLICATION_SECRET             |                                                      |   |   |   |
|$AZURE_DOMAIN                         |                                                      |   |   |   |
|$DISCORD_BOT_TOKEN                    |                                                      |   |   |   |
|$                                     |                                                      |   |   |   |
|$MINECRAFT_SERVER_HOST                |                                                      |   |   |   |
|$MINECRAFT_SERVER_PORT                |                                                      |   |   |   |
|$MINECRAFT_PING_COUNT_HOW_MANY_TIMES  |                                                      |   |   |   |
|$MINECRAFT_PING_INTERVAL_IN_MINUTES   |                                                      |   |   |   |

# License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

Waky's avatar is from the main character of "Serial Experiments Lain", a 1998 Japanese anime television series produced by Yasuyuki Ueda and animated by Triangle Staff.
