const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const Command = require("../../structures/Command");
const getGuildQueue = require("../../functions/music/getGuildQueue");

module.exports = new Command(
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
