const { CommandInteraction } = require("discord.js");
const { Queue } = require("discord-music-player");
const Client = require("../structures/Client.js");
const QueueData = require("../structures/QueueData.js");

module.exports =
  /**
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @returns {Queue}
   */
  (client, interaction) => {
    //If this server has a music queue already, get it. If not, create with new QueueData
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      console.log("Queue already exists!");
      guildQueue = client.player.getQueue(interaction.guildId);
      guildQueue.data.latestInteraction = interaction;
    } else {
      console.log("Queue does not exist! Making now!");
      guildQueue = client.player.createQueue(interaction.guildId, {
        data: new QueueData(interaction),
      });

      const { defaultRepeatMode } = client.getGuildConfig(interaction.guildId);
      guildQueue.setRepeatMode(defaultRepeatMode);
    }

    return guildQueue;
  };
