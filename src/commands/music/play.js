const Command = require("../../structures/Command.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");
const getGuildQueue = require("../../functions/getGuildQueue.js");

module.exports = new Command(
  "music",
  {
    name: "play",
    description: "Plays a song or adds it to the end of the music queue.",
    options: [
      {
        name: "song",
        description: "A URL or search query.",
        type: ApplicationCommandOptionType.String,
      },
    ],
  },

  async (client, interaction, args) => {
    if (!interaction.member.voice.channel) {
      return await interaction.followUp({
        content: "Join a voice channel first!",
      });
    }

    //No new song entered, assume user wants to resume music queue
    if (args.length != 1) {
      /** @type {Command} */
      const resumeCommand = client.commands.get("resume");
      if (!resumeCommand) return;
      return await client.runCommand(resumeCommand, interaction, args);
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
