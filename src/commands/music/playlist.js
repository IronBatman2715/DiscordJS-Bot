const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const getGuildQueue = require("../../functions/getGuildQueue.js");

module.exports = new Command(
  "music",
  {
    name: "playlist",
    description: "Plays a playlist or adds it to the end of the music queue.",
    options: [
      {
        name: "playlist",
        description: "A URL or search query.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    if (!interaction.member.voice.channel) {
      return await interaction.followUp({
        content: "Join a voice channel first!",
      });
    }

    const [playlistQuery] = args;

    let guildQueue = await getGuildQueue(client, interaction);

    await guildQueue.join(interaction.member.voice.channel);

    await guildQueue.playlist(playlistQuery, {
      shuffle: false,
      requestedBy: interaction.user,
    });
  }
);
