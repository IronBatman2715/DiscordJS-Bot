const { MessageReaction, User } = require("discord.js");
const Client = require("../structures/Client.js");
const Event = require("../structures/Event.js");

module.exports = new Event(
  /**
   * @param {Client} client
   * @param {MessageReaction} messageReaction
   * @param {User} user
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
