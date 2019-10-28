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
      category: "User",
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

    var reports;
    if (args[1]) reports = await Reports.find({ status: list, host: hostRegex });
    if (!args[1]) reports = await Reports.find({ status: list });
    var totalNr;
    if (args[1]) totalNr = await Reports.countDocuments({ status: list, host: hostRegex });
    if (!args[1]) totalNr = await Reports.countDocuments({ status: list });

    if (reports.length < 1) return reply(`No reports found on the specified list.`);
    var page = 1;
    var reportsLeft = reports.length;
    // if (reports.length > 10) {
      while (reportsLeft > 0 && page < 5) {
        var rprts = paginate(reports, 10, page);
        rprts = rprts.map(r => `(${r.id}) [${r.url}](${r.url})`);
        const embed = new Discord.MessageEmbed()
          .setTitle(`Viewing List Of ${lists[list]} ${args[1] ? "Hosted By " + args.slice(1).join(" ").toProperCase() : ""}`)
          .setDescription(`${rprts.join("\n")}\n\nShowing page **${page}** of **${Math.floor(reports.length / 10)}**.`)
          .setColor("RED")
          .setTimestamp();
        reply(embed);
        reportsLeft -= 10;
        page++;
      }
    //} else {
      //reports = reports.slice(reports.length - 10, reports.length);
     // reports = reports.map(r => `(${r.id}) [${r.url}](${r.url})`)
     // const embed = new Discord.MessageEmbed()
       // .setTitle(`Viewing List Of ${lists[list]} ${args[1] ? "Hosted By " + args[1].toProperCase() : ""}`)
      //  .setDescription(`${reports.join("\n")}\n\nShowing last **${reports.length}** results from a total of **${totalNr.toLocaleString()}** results.`)
      //  .setColor("RED")
      //  .setTimestamp();
     // reply(embed);
  //  }
  }
}

module.exports = List;

function paginate (arr, pageSize, selectedPage) {
  --selectedPage;
  const output = arr.slice(selectedPage * pageSize, (selectedPage + 1) * pageSize);
  return output;
}
