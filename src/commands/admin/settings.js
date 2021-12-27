const { Message, MessageEmbed } = require("discord.js");
const Client = require("../../structures/Client.js");
const Command = require("../../structures/Command.js");
const fs = require("fs");

const settings = [
  {
    name: "prefix",
    type: "string",
    description:
      'The command prefix. When at the beginning of a message, this tells the bot to scan the message for a command and (if applicable) it\'s arguments. [default: "!"]',
  },
  {
    name: "greetings",
    type: "string[]",
    description: `A list of greetings that the bot can give. Ex: upon call of the \`hello\` command.`,
  },
  {
    name: "maxMessagesCleared",
    type: "integer",
    range: [1, 100],
    description:
      "The maximum number of messages that the `clear` command can delete in one command call (maximum setting of `100`). [default: `100`]",
  },
  {
    name: "designatedMusicChannelIds",
    type: "string[]",
    description:
      "A list of text channel ids. If one or more are specified, ALL music commands MUST be entered one of these text channels. [default: `[]`]",
  },
];

module.exports = new Command({
  name: "settings",
  extraArguments: [
    {
      name: "setting to alter",
      type: "string",
      required: false,
    },
    {
      name: "new value",
      type: "any",
      required: true,
    },
  ],
  description: "Change/view guild settings.",
  permissions: ["ADMINISTRATOR"],

  /**
   * @param {Message} message
   * @param {string[]} args
   * @param {Client} client
   * @returns
   */
  async run(message, args, client) {
    console.log("Settings command:");

    //User wants to see current settings
    if (args.length == 1) {
      return displayCurrentSettings(message, client);
    }

    //User entered a setting to change
    if (args.length == 3) {
      return changeSetting(message, client, args[1], args[2]);
    }
  },
});

/**
 * @param {string} settingName
 * @returns {boolean}
 */
async function isValidSettingName(settingName) {
  const defaultGuildConfig = require("../../resources/data/guilds/default.json");

  if (defaultGuildConfig.hasOwnProperty(settingName)) {
    return true;
  } else {
    await message.reply(`Invalid setting name!`);
    return false;
  }
}

/**
 * @param {Message} message
 * @param {Client} client
 */
async function displayCurrentSettings(message, client) {
  const currentGuildConfig = client.getGuildConfig(message.guildId);

  let settingsFieldArr = [];
  for (const propt in currentGuildConfig) {
    //Check if is a valid property
    if (!isValidSettingName(propt)) return;

    let currentValue = currentGuildConfig[propt];
    if (Array.isArray(currentGuildConfig[propt])) {
      const array = currentGuildConfig[propt];
      currentValue = "[ ";
      for (let i = 0; i < array.length; i++) {
        currentValue = currentValue + array[i];
        if (i != array.length - 1) {
          currentValue = currentValue + ", ";
        }
      }
      currentValue = currentValue + " ]";
    }

    let setting = settings.filter((setting) => setting.name == propt)[0];

    settingsFieldArr.push({
      name: `\`${propt}\`: \`${currentValue}\``,
      value: setting.description,
      inline: false,
    });
  }

  const currentSettingsEmbed = new MessageEmbed({
    title: `${message.guild.name} [id: \`${message.guildId}\`] Server-wide Settings`,
    description: `*Refer to* \`${currentGuildConfig.prefix}help\` *to change a setting.*`,
    timestamp: message.createdTimestamp,
    color: "DARK_BLUE",
    fields: settingsFieldArr,
    footer: {
      text: `${client.config.name} v${client.config.version}`,
    },
  }).setThumbnail("attachment://settings.png");

  return await message.reply({
    embeds: [currentSettingsEmbed],
    files: ["./src/resources/assets/icons/settings.png"],
  });
}

/**
 * @param {Message} message
 * @param {Client} client
 * @param {string} settingName
 * @param {string} newSettingValue
 */
async function changeSetting(message, client, settingName, newSettingValue) {
  //Check if is a valid property
  if (!isValidSettingName(settingName)) return;

  const setting = settings.filter((setting) => setting.name == settingName)[0];

  const currentGuildConfig = client.getGuildConfig(message.guildId);

  const newValueArg = {
    name: settingName,
    type: setting.type,
    required: true,
    value: newSettingValue,
    range: setting.hasOwnProperty("range") ? setting.range : [],
  };
  console.log(`newValueArg: \n`, newValueArg, "\n");

  //DONT ALLOW CHANING ARRAY SETTINGS FOR NOW
  if (newValueArg.type.endsWith("[]")) {
    return await message.reply(
      `Currently not supporting changing settings with array data!`
    );
  }

  const isValidArg = require("../../functions/isValidArg.js");
  if (!isValidArg(newValueArg)) {
    return await message.reply(
      `New value is an invalid type (string, integer, etc.)!`
    );
  }

  switch (newValueArg.name) {
    case "prefix": {
      //If length is anything other than 1
      if (newValueArg.value.length != 1) {
        return await message.reply(
          `Prefix must be exactly one character long!`
        );
      }

      //If is a letter
      if (newValueArg.value.match(/[a-z]/i)) {
        return await message.reply(`Cannot make prefix a letter!`);
      }

      //Check if desired prefix is in blacklist
      const prefixBlacklist = ["/"];
      if (prefixBlacklist.indexOf(newValueArg.value) > -1) {
        return await message.reply(`Prefix can NOT be ${newValueArg.value}!`);
      }
      break;
    }

    default:
      console.log("This settings does not have a special argument check.");
      break;
  }

  let newGuildConfig = currentGuildConfig;
  newGuildConfig[newValueArg.name] =
    newValueArg.type == "integer"
      ? Number(newValueArg.value)
      : newValueArg.value;
  console.log(
    `New guild config [GuildId: ${message.guildId}]\n`,
    newGuildConfig,
    "\n"
  );

  fs.writeFileSync(
    `./src/resources/data/guilds/${message.guildId}.json`,
    JSON.stringify(newGuildConfig, null, "\t")
  );
  console.log(
    `Saved new guild config [GuildId: ${message.guildId}]\n`,
    client.getGuildConfig(message.guildId),
    "\n"
  );

  return await message.reply(
    `Changed \`${newValueArg.name}\` to \`${newValueArg.value}\``
  );
}
