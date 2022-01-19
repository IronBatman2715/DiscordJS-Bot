module.exports = [
  {
    name: "greetings",
    type: "string[]",
    description: `List of greetings that the bot can send.`,
  },
  {
    name: "maxMessagesCleared",
    type: "integer",
    range: [1, 100],
    description:
      "Maximum number of messages `/clear` can delete in one command call. [default: 100; max: 100]",
  },
  {
    name: "musicChannel",
    type: "string",
    description:
      "If specified, ALL music commands MUST be entered in this text channel! [default: none]",
  },
  {
    name: "defaultRepeatMode",
    type: "integer",
    description: "Default repeat mode of music player. [default: DISABLED]",
  },
];
