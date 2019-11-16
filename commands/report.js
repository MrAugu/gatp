const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");
const Websites = require("../models/websites.js");
const client = require("../index.js").Client;

class Report extends Command {
  constructor (client) {
    super(client, {
      name: "report",
      description: "Reports a website.",
      category: "User",
      usage: "",
      enabled: true,
      aliases: [],
      permLevel: "User",
      cooldown: 5,
      args: false
    });
  }


  async run (message, args, level, reply) { // eslint-disable-line no-unused-vars
    const count = await Websites.countDocuments();
    const filter = response => {
      return response.author.id === message.author.id;
    }
    reply("What's the website you want to report?")
    await message.channel.awaitMessages(filter, { max: 1 })
    .then(collected => {
      const website = collected.first().content;
      reply('What game is this website for?')
      message.channel.awaitMessages(filter, { max: 1 })
      .then(collected => {
        var game = collected.first().content;
        game = (!(["Growtopia"]).includes(game.toProperCase())) ? "Other" : game.toProperCase();
        reply("Where is it hosted? Type `.` if you don't know.")
        message.channel.awaitMessages(filter, { max: 1 })
        .then(collected => {
          const host = collected.first().content;
          new Websites({
            id: count + 1,
            url: `http://${website}`,
            host: host.length < 3 ? "Not Specified" : host,
            game: `${game}`,
            timestamp: Date.now()
          }).save().catch(e => console.error(e));
          const embed = new Discord.MessageEmbed()
            .setAuthor("GAPT", client.user.displayAvatarURL())
            .setTitle("New Report")
            .setDescription(`Website: http://${website}\nHosted On: ${host.length < 3 ? "Not Specified" : host}\nGame: ${game}\nCase ID: ${count + 1}`)
            .setColor("RED")
            .setTimestamp();
          client.channels.get("536531331903913985").send(embed);
          reply("Reported! Report ID: " + (count + 1) + "\n(You can use it to track your report)")
        });
      });
    });
  }
}

module.exports = Report;
