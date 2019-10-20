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
      .setColor("RED")
      .setTimestamp()
      .setFooter(`Bot & Website created and maintained by MrAugu.`);

    this.client.commands.map(c => embed.addField(`${c.help.name.toProperCase()} | \`=${c.help.name}\``, `Description: ${c.help.description}\nSyntax: \`=${c.help.name} ${c.help.usage}\`\nPermission: \`${c.conf.permLevel}\``));
    reply(embed);
  }
}

module.exports = Help;
