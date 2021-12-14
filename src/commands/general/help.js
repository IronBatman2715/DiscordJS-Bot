const { MessageEmbed } = require("discord.js");
const snakeCase2Display = require("../../functions/snakeCase2Display.js");
const Command = require("../../structures/Command.js");
const fs = require("fs");

module.exports = new Command({
  name: "help",
  aliases: ["h"],
  extraArguments: [
    {
      name: "command category",
      type: "string",
      required: false,
    },
  ],
  description: "Shows a list of available commands.",

  async run(message, args, client) {
    //Implement a multiple page reaction embed later with these: ⬅️➡️ ...?

    const { prefix } = client.getGuildConfig(message.guildId);

    //Verify arguments
    const pageName = args.length > 1 ? args[1].toLowerCase() : undefined;
    if (args.length == 2) {
      if (
        client.commands.filter((command) => command.type == pageName).length >=
        1
      ) {
        return await message.reply(
          `\`${args[1]}\` is not a valid command category!`
        );
      }
    } else if (args.length != 1) {
      return await message.reply("Invalid number of arguments submitted!");
    }

    const embed = new MessageEmbed({
      title: `${client.config.name} Command categories`,
      timestamp: message.createdTimestamp,
      color: "DARK_BLUE",
      footer: {
        text: `${client.config.name} v${client.config.version}`,
      },
    });

    let commandObjArr = [];
    let commandIndex = 0;
    //Iterate through each command type folder
    fs.readdirSync("./src/commands").forEach((dir) => {
      let dirName = dir.toString();
      dirName = dirName[0].toUpperCase() + dirName.slice(1);

      //Do not add dev commands to list
      if (dir !== "dev") {
        if (args.length == 1) {
          commandObjArr[commandIndex] = {
            name: dirName,
            value: `\`${prefix}${this.name} ${dir.toString().toLowerCase()}\``,
            inline: true,
          };

          commandIndex++;
        } else if (dir == pageName) {
          embed
            .setTitle(`${client.config.name} ${dirName} Commands`)
            .setDescription("Arguments: `[required]`, `(optional)`");

          fs.readdirSync(`./src/commands/${dir}`)
            .filter((file) => file.endsWith(".js"))
            .forEach((file) => {
              /**
               * @type {Command}
               */
              const command = require(`../${dir}/${file}`);

              //Do not add W.I.P commands to list
              if (command.name != "roll") {
                let extraArgumentsEntry = "";
                if (command.extraArguments.length > 0) {
                  command.extraArguments.forEach((extraArgument) => {
                    extraArgumentsEntry =
                      extraArgumentsEntry +
                      ` ${extraArgument.required ? "[" : "("}${
                        extraArgument.name
                      }${extraArgument.required ? "]" : ")"}`;
                  });
                }

                let aliasesEntry = "";
                if (command.aliases.length > 0) {
                  aliasesEntry = "Alias";
                  if (command.aliases.length > 1) {
                    aliasesEntry = aliasesEntry + "es";
                  }

                  aliasesEntry =
                    aliasesEntry + `: \`${prefix}${command.aliases[0]}`;
                  for (let i = 1; i < command.aliases.length; i++) {
                    aliasesEntry =
                      aliasesEntry + `, ${prefix}${command.aliases[i]}`;
                  }
                  aliasesEntry = aliasesEntry + "`\n";
                }

                let permissionsEntry = "";
                if (command.permissions.length > 0) {
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
                }

                commandObjArr[commandIndex] = {
                  name: `\`${prefix}${command.name}${extraArgumentsEntry}\``,
                  value: `${aliasesEntry}${command.description}${permissionsEntry}`,
                  inline: true,
                };

                commandIndex++;
              }
            });
        }
      }
    });

    embed.setFields(commandObjArr);

    return await message.channel.send({ embeds: [embed] });
  },
});
