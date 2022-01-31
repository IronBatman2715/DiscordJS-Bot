const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const getGuildQueue = require("../../functions/music/getGuildQueue.js");

module.exports = new Command(
  {
    name: "play",
    description: "Plays a song or adds it to the end of the music queue.",
    options: [
      {
        name: "song",
        description: "A URL or search query.",
        type: ApplicationCommandOptionType.String,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    //Check if user is currently in a voice channel
    if (!interaction.member.voice.channel) {
      return await interaction.followUp({
        content: "Join a voice channel first!",
      });
    }

    const [songQuery] = args;

    let guildQueue = await getGuildQueue(client, interaction);

    await guildQueue.join(interaction.member.voice.channel);

    await guildQueue.play(songQuery, {
      timecode: true,
      requestedBy: interaction.user,
    });
  }
);
