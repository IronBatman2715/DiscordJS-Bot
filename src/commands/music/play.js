const Command = require("../../structures/Command.js");
const QueueData = require("../../structures/QueueData.js");

module.exports = new Command({
  name: "play",
  aliases: ["p", "playlist"],
  extraArguments: [
    {
      name: "song/playlist query",
      type: "string",
      required: true,
    },
  ],
  description: "Plays music in your voice channel.",

  async run(message, args, client) {
    if (!message.member.voice.channel) {
      return await message.reply("Join a voice channel first!");
    }

    //No new song/playlist entered, assume user wants to resume music queue
    if (args.length < 2) {
      let resumeCommand = client.commands.find((cmd) => cmd.name == "resume");
      resumeCommand.run(message, args, client);
      return;
    }

    message.react("👌");

    //If this server has a music queue already, get it. If not, create with new QueueData
    let guildQueue;
    if (client.player.hasQueue(message.guild.id)) {
      console.log("Queue already exists!");
      guildQueue = client.player.getQueue(message.guild.id);
      guildQueue.data.latestMessage = message;
    } else {
      console.log("Queue does not exist! Making now!");
      guildQueue = client.player.createQueue(message.guild.id, {
        data: new QueueData(message),
      });
    }

    await guildQueue.join(message.member.voice.channel);

    //Switch through aliases
    switch (args[0]) {
      case "play":
      case "p":
        await guildQueue.play(args.slice(1).join(" "), {
          timecode: true,
          requestedBy: message.author,
        });
        break;
      case "playlist":
        await guildQueue.playlist(args.slice(1).join(" "), {
          shuffle: false,
          requestedBy: message.author,
        });
        break;

      default:
        return console.error(
          `Commands/${this.name}: ran ${this.name} command but could not match argument to name or alias(es)`
        );
    }
  },
});
