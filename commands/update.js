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

class Update extends Command {
  constructor (client) {
    super(client, {
      name: "update",
      description: "Updates a website's status.",
      category: "Staff",
      usage: "<report number> <list>",
      enabled: true,
      aliases: ["u"],
      permLevel: "Staff",
      cooldown: 0,
      args: true
    });
  }

  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    var report = parseInt(args[0]);
    if (!args[1] || !isNaN(list) || args[1] && isNaN(parseInt(args[1]))) return reply(`Incorrect syntax. Correct syntax: \`=update <report number> <list>\`\n**DO NOT INCLUDE \`<>\`.**`);
    var list = parseInt(args[1]);
    if (list < 0 || list > 4) return reply(`Invalid list. The list convention is the following:\n0 - Received Reports (Neither reported or discared.)\n1 - Reported Websites (Host of the website's been contacted.)\n2 - Taken Down Websites (Websites suspended by the host.)\n3 - Dismissed Reports (Troll reports that are 'deleted'.)\n4 - Has a Domain(Framed websites)`);

    var dbReport = await Reports.findOne({ id: report });
    if (!dbReport) return reply(`Report could not be found.`);
    dbReport.status = list;
    await dbReport.save().catch(e => console.error(e));

    if (list === 2) {
      const embed = new Discord.MessageEmbed()
        .setTitle("Website Taken Down!")
        .setURL("https://gapt.xyz")
        .setDescription(`**Website:** ${dbReport.url}\n**Hosted On:** ${dbReport.host}\n**Case ID:** ${dbReport.id}\nHooray!`)
        .setColor("AQUA")
        .setTimestamp();
      this.client.channels.get("535458392852922368").send(embed);
    }

    return reply(`Updated ${dbReport.url} to ${lists[list]}.`);
  }
}

module.exports = Update;
