const Discord = require("discord.js");
const Client = require("../structures/Client.js");
const Event = require("../structures/Event.js");

module.exports = new Event(
  "messageReactionAdd",
  /**
   * @param {Client} client
   * @param {Discord.MessageReaction} messageReaction
   * @param {Discord.User} user
   */
  (client, messageReaction, user) => {
    let message = messageReaction.message;
    if (message.author.bot && message.author.id === client.user.id) {
      console.log("Reaction added to one of THIS bot's messages!");
      if (message.embeds.length == 1) {
        console.log(
          "Reaction added to one of THIS bot's messages that ALSO has only one embed!"
        );
      }
    }
    let emoji = messageReaction.emoji;

    console.log(`${user.username} added ${emoji} to a message!`);
  }
);
