const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Reports = require("../models/websites.js");
const lists = {
  0: "Received Reports",
  1: "Reported Websites",
  2: "Taken Down Websites",
  3: "Discarded Reports",
  4: "Has a Domain"
};

class List extends Command {
  constructor (client) {
    super(client, {
      name: "list",
      description: "Shows list of websites.",
      category: "Staff",
      usage: "<list number>",
      enabled: true,
      aliases: [],
      permLevel: "User",
      cooldown: 0,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var list = parseInt(args[0]);
    if (isNaN(list)) return reply(`Invalid list. The list convention is the following:\n0 - Received Reports (Neither reported or discared.)\n1 - Reported Websites (Host of the website's been contacted.)\n2 - Taken Down Websites (Websites suspended by the host.)\n3 - Dismissed Reports (Troll reports that are 'deleted'.)\n4 - Has a Domain(Framed websites)`);
    if (list < 0 || list > 4) return reply(`Invalid list. The list convention is the following:\n0 - Received Reports (Neither reported or discared.)\n1 - Reported Websites (Host of the website's been contacted.)\n2 - Taken Down Websites (Websites suspended by the host.)\n3 - Dismissed Reports (Troll reports that are 'deleted'.)\n4 - Has a Domain(Framed websites)`);

    const hostRegex = new RegExp(args.slice(1).join(" "), "i");
    var pg;

    var indx = 0;

    for (const arg of args) {
      if (arg.toLowerCase().startsWith("p")) {
        pg = parseInt(arg.replace("p", ""));
        args = args.splice(indx, 1);
      }
      indx++;
    }

    if (isNaN(pg)) pg = null;

    var reports;
    if (args[1]) reports = await Reports.find({ status: list, host: hostRegex });
    if (!args[1]) reports = await Reports.find({ status: list });
    var totalNr;
    if (args[1]) totalNr = await Reports.countDocuments({ status: list, host: hostRegex });
    if (!args[1]) totalNr = await Reports.countDocuments({ status: list });

    if (reports.length < 1) return reply(`No reports found on the specified list.`);
    var page = 1;
    var reportsLeft = reports.length;
    if (!pg) {
      while (reportsLeft > 0 && page < 5) {
        var rprts = paginate(reports, 10, page);
        rprts = rprts.map(r => `${r.id} • [${r.url}](${r.url})`);
        const embed = new Discord.MessageEmbed()
          .setTitle(`${lists[list]} ${args[1] ? "- Hosted By " + args.slice(1).join(" ").toProperCase() : ""}`)
          .setDescription(`${rprts.join("\n")}\n\n- Page **${page}**/**${Math.ceil(reports.length / 10) || 1}**\n- **${reports.length.toLocaleString()}** Total Results`)
          .setColor("AQUA")
          .setTimestamp();
        reply(embed);
        reportsLeft -= 10;
        page++;
      }
    } else {
      var rprts = paginate(reports, 10, pg);
        rprts = rprts.map(r => `${r.id} • [${r.url}](${r.url})`);
        const embed = new Discord.MessageEmbed()
          .setTitle(`${lists[list]} ${args[1] ? "- Hosted By " + args.slice(1).join(" ").toProperCase() : ""}`)
          .setDescription(`${rprts.join("\n")}\n\n- Page **${pg}**/**${Math.ceil(reports.length / 10) || 1}**\n- **${reports.length.toLocaleString()}** Total Results`)
          .setColor("AQUA")
          .setTimestamp();
        reply(embed);
    }
  }
}

module.exports = List;

function paginate (arr, pageSize, selectedPage) {
  --selectedPage;
  const output = arr.slice(selectedPage * pageSize, (selectedPage + 1) * pageSize);
  return output;
}
