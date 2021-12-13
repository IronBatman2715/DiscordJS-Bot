const Discord = require("discord.js");
const Command = require("../../structures/Command.js");

module.exports = new Command({
  name: "embed",
  description: "Shows a test embed.",
  permissions: ["ADMINISTRATOR"],

  async run(message, args, client) {
    let embed = new Discord.MessageEmbed({
      title: `Test embed`,
      description: `This is a cool test embed!`,
      url: "https://discord.js.org/#/docs/main/stable/general/welcome",
      timestamp: message.createdTimestamp,
      color: "DARK_BLUE",
      fields: [
        {
          name: "Test field name",
          value: "Test field value",
          inline: false,
        },
      ],
      author: {
        name: message.author.username,
        url: "https://sites.google.com/view/z27",
        iconURL: message.author.avatarURL({ dynamic: true }),
      },
      thumbnail: {
        url: "https://www.seoptimer.com/blog/wp-content/uploads/2018/09/image22.png",
      },
      image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/U%2B2160.svg/1200px-U%2B2160.svg.png",
      },
      footer: {
        text: `${client.config.name} v${client.config.version}`,
      },
    });

    return await message.reply({ embeds: [embed] });
  },
});
