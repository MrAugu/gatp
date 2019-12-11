const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Websites = require("../models/websites.js");
const client = require("../index.js").Client;
const status = {
  0: "Pending Report",
  1: "Reported",
  2: "Taken Down"
};

class Track extends Command {
  constructor (client) {
    super(client, {
      name: "track",
      description: "Tracks a reported website by ID.",
      category: "User",
      usage: "",
      enabled: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: true
    });
  }


  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var id = parseInt(args[0])
    const report = await Websites.findOne({ id: id });
    if (!report) return reply("Report could not be found!")
    reply("Website Url: ${report.url}\nReport Status: ${status[report.status]}")
  }
}

module.exports = Track;
