const DiscordClient = require("discord.js").Client;
const {
  Collection,
  CommandInteraction,
  Intents,
  MessageEmbed,
  MessageEmbedOptions,
  Permissions,
} = require("discord.js");
const Command = require("./Command");
const logger = require("../functions/general/logger");

module.exports = class Client extends DiscordClient {
  /** @type {boolean} _ denotes protected */
  _devMode;
  /** @type {string[]} _ denotes protected */
  _commandTypes;

  /**
   * @param {boolean} devMode Set true to register developer commands to the discord server corresponding to environment variable `TEST_GUILD_ID`
   */
  constructor(devMode) {
    console.log("*** DISCORD JS BOT: INITIALIZATION ***");

    super({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
      allowedMentions: { repliedUser: false },
    });

    /**
     * @typedef {{type: string; name: string}} ActivitesOptions
     * @type {{name: string; activities: ActivitesOptions[]}}
     */
    this.config = require("../resources/data/config.json"); //universal bot configs

    this._devMode = devMode;

    const { Player } = require("discord-music-player");
    this.player = new Player(this, {
      deafenOnJoin: true,
    });

    //Load scripts
    console.log(`Loading ${this.config.name}: ${this._devMode ? "DEV" : "PRODUCTION"} MODE`);

    const commandDataArr = this.loadCommands();
    if (this.devMode) this.registerCommands(commandDataArr);
    this.loadEvents();

    const DB = require("./DB");
    this.DB = new DB();

    console.log("*** DISCORD JS BOT: INITIALIZATION DONE ***");
  }

  get devMode() {
    return this._devMode;
  }

  get commandTypes() {
    return this._commandTypes;
  }

  /** Login to Discord API */
  async start() {
    logger("Logging in... ");
    await this.login(process.env.TOKEN);
  }

  /** Load slash commands */
  loadCommands() {
    console.log("Commands:");

    /** @type {Collection<string, Command>} */
    this.commands = new Collection();

    this._commandTypes = [];

    const { RESTPostAPIApplicationCommandsJSONBody } = require("discord-api-types/v9");
    /** @type {RESTPostAPIApplicationCommandsJSONBody[]} */
    let commandDataArr = [];

    const { readdirSync } = require("fs");
    readdirSync("./src/commands").forEach((folder) => {
      console.log(`\t${folder}`);
      readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          /** @type {Command} */
          const command = require(`../commands/${folder}/${file}`);

          //Set and store command types
          command.setType(folder);
          if (!this.commandTypes.includes(folder)) {
            this._commandTypes.push(folder);
          }

          if (command.type == "dev" && !this.devMode) {
            //do NOT register this command
          } else {
            this.commands.set(command.data.name, command);
            commandDataArr.push(command.data);

            console.log(`\t\t${command.data.name}`);
          }
        });
    });

    return commandDataArr;
  }

  /** Register commands with Discord API
   * @param {RESTPostAPIApplicationCommandsJSONBody[]} commandDataArr
   * @param {string} scope Set to `"global"` to globally register commands. Otherwise, defaults to environment variable `TEST_GUILD_ID`
   */
  registerCommands(commandDataArr, scope = "") {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    (async () => {
      try {
        logger("Registering commands with Discord API...");

        if (scope === "global") {
          //Register globally, will take a few minutes to register changes
          logger(" PRODUCTION MODE. Registering to any server this bot is in\n");

          await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commandDataArr,
          });
        } else {
          //Instantly register to test guild
          logger(` DEV MODE. Only registering in "TEST_GUILD_ID" environment variable\n`);

          await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID),
            {
              body: commandDataArr,
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }

  async clearGlobalCommands() {
    const { REST } = require("@discordjs/rest");
    const { Routes } = require("discord-api-types/v9");

    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

    try {
      logger("Clearing global commands from Discord API...");

      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: [],
      });
    } catch (error) {
      console.error(error);
    }
  }

  /** Load events */
  loadEvents() {
    console.log("Events:");
    const { EventEmitter } = require("events");
    const { readdirSync } = require("fs");
    const mongoose = require("mongoose");
    const capitalize = require("../functions/general/capitalize");

    readdirSync("./src/events").forEach((folder) => {
      console.log(`\t${capitalize(folder)}`);

      /** @type {EventEmitter} */
      let eventObject;
      switch (folder) {
        case "client": {
          eventObject = this;
          break;
        }
        case "mongoose": {
          eventObject = mongoose.connection;
          break;
        }
        case "music-player": {
          eventObject = this.player;
          break;
        }

        default: {
          console.error("Could not match events folder name to event object instance!");
          return;
        }
      }

      readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          const eventName = file.slice(0, file.length - 3);
          /** @type {Function} */
          const eventFunction = require(`../events/${folder}/${file}`);

          //Tie to approriate instance
          eventObject.on(eventName, eventFunction.bind(null, this));

          console.log(`\t\t${eventName}`);
        });
    });
  }

  /**
   * @param {MessageEmbedOptions} data
   * @returns {MessageEmbed}
   */
  genEmbed(data = {}) {
    const embed = new MessageEmbed(data);

    if (!data.hasOwnProperty("timestamp")) {
      embed.setTimestamp(new Date());
    }
    if (!data.hasOwnProperty("color")) {
      embed.setColor("DARK_BLUE");
    }
    if (!data.hasOwnProperty("footer")) {
      embed.setFooter({
        text: this.config.name,
      });
    }

    return embed;
  }

  /**
   * @param {Command} command
   * @param {CommandInteraction} interaction
   * @param {any[]} args
   */
  async runCommand(command, interaction, args) {
    switch (command.type) {
      //Admin only commands
      case "admin": {
        const isUser = require("../functions/discord/isUser");

        if (
          !isUser(interaction.member, {
            permissions: Permissions.FLAGS.ADMINISTRATOR,
          })
        ) {
          return await interaction.followUp({
            content: `This is a administrator only command!`,
          });
        }
        break;
      }

      //Developer only commands
      case "dev": {
        const isUser = require("../functions/discord/isUser");

        if (
          !isUser(interaction.member, {
            userIdList: process.env.DEV_IDS.includes(", ")
              ? process.env.DEV_IDS.split(", ")
              : process.env.DEV_IDS,
          })
        ) {
          return await interaction.followUp({
            content: `This is a developer only command!`,
          });
        }
        break;
      }

      case "music": {
        const { musicChannel } = await this.DB.getGuildConfig(interaction.guildId);

        if (musicChannel != "" && interaction.channelId != musicChannel) {
          const musicChannelObj = await interaction.guild.channels.fetch(musicChannel);
          return await interaction.followUp({
            content: `Must enter music commands in ${musicChannelObj}!`,
          });
        }
        break;
      }

      case "general":
      default: {
        break;
      }
    }

    try {
      await command.run(this, interaction, args);
      console.log(`Ran Commands/${command.type}/${command.data.name}\n`);
    } catch (error) {
      console.error(error);
      return await interaction.followUp({
        content: `There was an error while executing \`${command.data.name}\` command!`,
      });
    }
  }
};
