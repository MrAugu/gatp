const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Help extends Command {
  constructor (client) {
    super(client, {
      name: "help",
      description: "Shows a list of valid commands.",
      category: "General",
      usage: "",
      enabled: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor("AQUA")
      .setTimestamp();

    embed.addField("General Commands:", `\`${this.client.commands.filter(c => c.help.category === "General").map(c => `=${c.help.name}`).join("\`, \`")}\``);
    embed.addField("Staff:", `\`${this.client.commands.filter(c => c.help.category === "Staff").map(c => `=${c.help.name}`).join("\`, \`")}\``);

    reply(embed);
  }
}

module.exports = Help;
