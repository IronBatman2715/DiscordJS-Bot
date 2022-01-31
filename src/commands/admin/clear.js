const Command = require("../../structures/Command.js");
const tempMessage = require("../../functions/discord/tempMessage.js");
const isInRange = require("../../functions/general/isInRange.js");
const { ApplicationCommandOptionType } = require("discord-api-types/v9");

module.exports = new Command(
  {
    name: "clear",
    description: "ADMIN ONLY: Clear messages from the text channel!",
    //default_permission: false,
    options: [
      {
        name: "quantity",
        description: "Number of messages to delete",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },

  async (client, interaction, args) => {
    const [quantity] = args;
    //console.log("quantity: {", typeof quantity, "} ", quantity);

    const { maxMessagesCleared } = await client.DB.getGuildConfig(interaction.guildId);

    //Check if desired number is within allowed range
    if (!isInRange(quantity, 1, maxMessagesCleared)) {
      return await interaction.followUp({
        content: `You can not clear ${quantity} messages! Allowed range is from 1 to ${maxMessagesCleared}.`,
      });
    }

    const channel = interaction.channel;
    try {
      const messagesToDelete = await channel.messages.fetch({
        limit: quantity,
        before: interaction.id,
      });
      //console.log("messagesToDelete: ", messagesToDelete);

      //Note: 2nd argument in bulkDelete filters out messages >=2 weeks old, as they cannot be deleted via bulkDelete
      await channel.bulkDelete(messagesToDelete, true);

      //Confirmation message
      await tempMessage(
        interaction,
        `Cleared \`${quantity}\` message${quantity == 1 ? "" : "s"}`,
        true,
        3,
        1
      );
    } catch (error) {
      console.error(error);
    }
  }
);
