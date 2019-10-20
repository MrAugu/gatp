const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Reports = require("../models/websites.js");

class List extends Command {
  constructor (client) {
    super(client, {
      name: "list",
      description: "Shows list of websites.",
      category: "Staff",
      usage: "<list number>",
      enabled: true,
      aliases: [],
      permLevel: "Staff",
      cooldown: 5,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var list = parseInt(args[0]);
    if (isNaN(list)) return reply(`Invalid list. The list convention is the following:\n0 - Received Reports (Neither reported or discared.)\n1 - Reported Websites (Host of the website's been contacted.)\n2 - Taken Down Websites (Websites suspended by the host.)\n3 - Dismissed Reports (Troll reports that are 'deleted'.)`);
    if (list < 0 || list > 3) return reply(`Invalid list. The list convention is the following:\n0 - Received Reports (Neither reported or discared.)\n1 - Reported Websites (Host of the website's been contacted.)\n2 - Taken Down Websites (Websites suspended by the host.)\n3 - Dismissed Reports (Troll reports that are 'deleted'.)`);

    var reports = await Reports.find({ status: list });
    const totalNr = await Reports.countDocuments({ status: list });

    if (reports.length < 1) return reply(`No reports found on the specified list.`);

    reports = reports.slice(reports.length - 25, reports.length);
    reports = reports.map(r => `${r.id} - [${r.url}](${r.url})`)
    const embed = new Discord.MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setTitle(`Search Results for List ${list}`)
      .setDescription(`${reports.join("\n")}\n\nShowing last **${reports.length}** results from a total of **${totalNr.toLocaleString()}** results.`)
      .setColor("RED")
      .setTimestamp();
    reply(embed);
  }
}

module.exports = List;
