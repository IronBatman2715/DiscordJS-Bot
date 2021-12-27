const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const PlayerEvent = require("./PlayerEvent.js");
const { Player } = require("discord-music-player");
const fs = require("fs");

module.exports = class Client extends Discord.Client {
  constructor() {
    console.log("*** DISCORD JS BOT: INITIALIZATION ***");

    super({
      intents: new Discord.Intents([
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
      ]),
      allowedMentions: { repliedUser: false },
    });

    this.config = require("../resources/data/config.json"); //universal bot configs

    console.log(`Loading ${this.config.name} v${this.config.version}`);
  }

  start(token) {
    this.registerCommands();
    this.registerEvents();
    this.registerPlayerEvents();

    this.login(token);
    console.log("*** DISCORD JS BOT: INITIALIZATION DONE ***");
  }

  registerCommands() {
    console.log("Commands:");
    /**
     * @type {Discord.Collection<string, Command>}
     */
    this.commands = new Discord.Collection();
    fs.readdirSync("./src/commands").forEach((dir) => {
      //Register each folder of commands
      console.log(`\t${dir}`);
      fs.readdirSync(`./src/commands/${dir}`)
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          /**
           * @type {Command}
           */
          const command = require(`../commands/${dir}/${file}`);
          command.type = dir.toString().toLowerCase();
          this.commands.set(command.name, command);
          console.log(`\t\t${command.name}`);
        });
    });
  }

  registerEvents() {
    console.log("Events:");
    fs.readdirSync("./src/events")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const eventName = file.slice(0, file.length - 3);
        /** @type {Event} */
        const event = require(`../events/${file}`);

        this.on(eventName, event.runFunction.bind(null, this));
        console.log(`\t${eventName}`);
      });
  }

  registerPlayerEvents() {
    console.log("Player Events:");
    /**
     * @type {Player}
     */
    this.player = new Player(this, {
      leaveOnEmpty: false,
      deafenOnJoin: true,
    });
    fs.readdirSync("./src/playerEvents")
      .filter((file) => file.endsWith(".js"))
      .forEach((file) => {
        const playerEventName = file.slice(0, file.length - 3);
        /**
         * @type {PlayerEvent}
         */
        const playerEvent = require(`../playerEvents/${file}`);
        this.player.on(
          playerEventName,
          playerEvent.runFunction.bind(null, this)
        );
        console.log(`\t${playerEventName}`);
      });
  }

  /**
   * Get the guild config data corresponding to guildId. If does not exist, generate based on defaults!
   * @typedef {{prefix: string, greetings: string[], maxMessagesCleared: Number, designatedMusicChannelIds: string[]}} GuildConfig
   * @param {string} guildId
   * @returns {GuildConfig}
   */
  getGuildConfig(guildId) {
    let guildConfigFileName = fs
      .readdirSync("./src/resources/data/guilds")
      .filter((file) => file == `${guildId}.json`);

    switch (guildConfigFileName.length) {
      //Guild config file does not exist yet
      case 0: {
        console.log(
          "Guild config file not present. Generating one with the default values!"
        );

        guildConfigFileName = `${guildId}.json`;

        fs.copyFileSync(
          "./src/resources/data/guilds/default.json",
          `./src/resources/data/guilds/${guildConfigFileName}`
        );
      }
      case 1:
        return require(`../resources/data/guilds/${guildConfigFileName}`);

      default:
        message.reply(
          "Found multiple config files for your server! Using default for now.\nAsk dev to check out this bug!"
        );

        return require(`../resources/data/guilds/default.json`);
    }
  }
};
