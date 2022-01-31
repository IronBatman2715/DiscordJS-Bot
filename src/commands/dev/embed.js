const { MessageEmbed } = require("discord.js");
const Command = require("../../structures/Command.js");

module.exports = new Command(
  {
    name: "embed",
    description: "DEV ONLY: Shows a test embed.",
  },

  async (client, interaction, args) => {
    const embed = client.genEmbed({
      title: `Test embed`,
      description: `This is a cool test embed!`,
      url: "https://discord.js.org/#/docs/main/stable/general/welcome",
      timestamp: interaction.createdTimestamp,
      color: "DARK_BLUE",
      fields: [
        {
          name: "Test field name",
          value: "Test field value",
          inline: false,
        },
      ],
      author: {
        name: interaction.member.user.username,
        url: "https://sites.google.com/view/z27",
        iconURL: interaction.member.avatarURL({ dynamic: true }),
      },
      thumbnail: {
        url: "https://www.seoptimer.com/blog/wp-content/uploads/2018/09/image22.png",
      },
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/U%2B2160.svg/1200px-U%2B2160.svg.png",
      },
      footer: {
        text: client.config.name,
      },
    });

    return await interaction.followUp({ embeds: [embed] });
  }
);
