const { Schema, model } = require("mongoose");

const GuildConfigSchema = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  greetings: {
    type: [String],
    required: true,
    default: [
      "Hello!",
      "Hello there!",
      "How are you!",
      "Howdy!",
      "What's up chief?",
      "Greetings",
      "What's cracka-lackin?!",
      "Sup bro",
      "What's up boss?",
      "Ah, hello human",
    ],
  },
  maxMessagesCleared: {
    type: Number,
    required: true,
    default: 100,
  },
  musicChannel: {
    type: String,
    required: false,
    default: "",
  },
  defaultRepeatMode: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = model("guildConfig", GuildConfigSchema);
