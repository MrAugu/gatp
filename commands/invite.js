const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Invite extends Command {
  constructor (client) {
    super(client, {
      name: "invite",
      description: "Gives you the official server invite and the bot invite.",
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
      .addField(`Join my Server`, `Join my server by [clicking here.](https://discord.gg/xaTp9ru)`)
      .addField(`Have me Join your Server`, `I can join your server by having you [click here.](https://discordapp.com/oauth2/authorize?client_id=634101094905020436&permissions=8&scope=bot)`)
      .setTimestamp()
      .setFooter(`Bot & Website created and maintained by MrAugu.`);
    reply(embed);
  }
}

module.exports = Invite;
