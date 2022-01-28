const { Interaction, CommandInteractionOption } = require("discord.js");
const Client = require("../structures/Client.js");
const Command = require("../structures/Command.js");

module.exports =
  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  async (client, interaction) => {
    if (interaction.isCommand()) {
      //console.log("CommandInteraction created!");

      //Show user that command is loading
      await interaction.deferReply().catch((error) => {
        console.error(error);
      });

      /** @type {Command} */
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      const args = [];
      //console.log("interaction.options.data: ", interaction.options.data);
      interaction.options.data.map((option) => parseArgs(option, args));
      console.log("args: ", args);

      await client.runCommand(command, interaction, args);
    } else if (interaction.isSelectMenu()) {
      //console.log("SelectMenuInteraction created!");
      //console.log("values selected: ", interaction.values);

      //Show user that command is loading
      await interaction.deferUpdate().catch((error) => {
        console.error(error);
      });

      switch (interaction.customId) {
        case `${client.config.name}-help-select-menu`: {
          const [dir] = interaction.values;

          const helpEmbed = client.genEmbed();

          /** @type {EmbedFieldData[]} */
          let commandObjArr = [];
          let commandIndex = 0;
          const dirName = dir[0].toUpperCase() + dir.slice(1);

          helpEmbed.setTitle(`${dirName} Commands`);

          const { readdirSync } = require("fs");
          readdirSync(`./src/commands/${dir}`)
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
              /** @type {Command} */
              const command = require(`../commands/${dir}/${file}`);
              //console.log("command.data.options: ", command.data.options);

              let extraArgumentsEntry = "";

              let permissionsEntry = "";
              /*if (command.permissions.length > 0) {
                permissionsEntry = "\n**Permission";
                if (command.permissions.length > 1) {
                  permissionsEntry = permissionsEntry + "s";
                }

                permissionsEntry =
                  permissionsEntry +
                  `: ${snakeCase2Display(command.permissions[0])}`;
                for (let i = 1; i < command.permissions.length; i++) {
                  permissionsEntry =
                    permissionsEntry +
                    `, ${snakeCase2Display(command.permissions[i])}`;
                }
                permissionsEntry = permissionsEntry + "**";
                }*/

              commandObjArr[commandIndex] = {
                name: `\`/${command.data.name}${extraArgumentsEntry}\``,
                value: `${command.data.description}${permissionsEntry}`,
                inline: true,
              };

              commandIndex++;
            });

          helpEmbed.setFields(commandObjArr);

          return await interaction.editReply({ embeds: [helpEmbed] });
        }

        default: {
          return console.log("Could not match customId of select menu to one of this bot's!");
        }
      }
    }
  };

/**
 * @param {CommandInteractionOption} option
 * @param {any[]} args
 */
function parseArgs(option, args) {
  //console.log("option: ", option, "\n\n");
  if (option.hasOwnProperty("value")) {
    args.push(option.value);
  } else {
    args.push(option.name);
    if (option.hasOwnProperty("options")) {
      parseArgs(option.options[0], args);
    }
  }
}
