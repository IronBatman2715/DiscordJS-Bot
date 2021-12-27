const { RepeatMode } = require("discord-music-player");
const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = new Command(
  "music",
  {
    name: "repeat",
    description: "Set the repeat mode of the music queue.",
    options: [
      {
        name: "option",
        description: "Repeat mode to use.",
        type: ApplicationCommandOptionType.Integer,
        required: true,
        choices: [
          {
            name: "disable",
            value: RepeatMode.DISABLED,
          },
          {
            name: "song",
            value: RepeatMode.SONG,
          },
          {
            name: "queue",
            value: RepeatMode.QUEUE,
          },
        ],
      },
    ],
  },

  async (client, interaction, args) => {
    //Get queue
    let guildQueue;
    if (client.player.hasQueue(interaction.guildId)) {
      guildQueue = client.player.getQueue(interaction.guildId);
    } else {
      return interaction.followUp({
        content:
          "Cannot set the repeat mode of a queue that has not been started!",
      });
    }

    const [repeatMode] = args;
    let repeatModeStr;
    switch (repeatMode) {
      case RepeatMode.DISABLED:
        repeatModeStr = "disabled";
        break;
      case RepeatMode.SONG:
        repeatModeStr = "song";
        break;
      case RepeatMode.QUEUE:
        repeatModeStr = "queue";
        break;
    }

    //Change the repeat behvior of the queue
    if (guildQueue.repeatMode == repeatMode) {
      return interaction.followUp({
        content: `Already set to that repeat mode (${repeatModeStr})!`,
      });
    }
    guildQueue.setRepeatMode(repeatMode);
    return interaction.followUp({
      content: `Set music queue repeat mode to: ${repeatModeStr}!`,
    });
  }
);
