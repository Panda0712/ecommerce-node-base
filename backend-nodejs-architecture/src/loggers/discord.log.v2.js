"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_CHANNELID, DISCORD_TOKEN } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = DISCORD_CHANNELID;

    this.client.on("ready", () => {
      console.log(`Logged is as ${this.client.user.tag}`);
      console.log(DISCORD_CHANNELID);
      console.log(DISCORD_TOKEN);
    });

    this.client.login(DISCORD_TOKEN);
  }

  sendFormatCode(logData) {
    const {
      code,
      message = "This is some additional infomation about the code!",
      title = "Code Example",
    } = logData;

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendMessage(codeMessage);
  }

  sendMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.error("Couldn't find the channel...", this.channelId);
      return;
    }

    channel.send(message).catch((e) => console.error(e));
  }
}

module.exports = new LoggerService();
