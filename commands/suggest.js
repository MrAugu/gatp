const Discord = require ("discord.js"); // eslint-disable-line no-unused-vars
const Command = require("../base/Command.js");

class Suggest extends Command {
  constructor (client) {
    super(client, {
      name: "suggest",
      description: "Sends a suggestion.",
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
    var idea = args.join(" ");
    const filter = response => {
      return response.author.id === message.author.id;
    }
    reply("What is the title?")
    await message.channel.awaitMessages(filter, { max: 1 })
    .then(collected => {
      const title = collected.first();
      reply('What is the description?')
      message.channel.awaitMessages(filter, { max: 1 })
      .then(collected => {
        const desc = collected.first()
        const embed = new Discord.MessageEmbed()
          .setAuthor(message.author.tag, message.author.displayAvatarURL())
          .setTitle("New Suggestion!")
          .setDescription(`**Title:**\n${title}\n**Description:**\n${desc}`)
          .setColor("BLUE")
          .setTimestamp();
          const no = message.guild.emojis.find(emoji => emoji.name === 'no');
          const yes = message.guild.emojis.find(emoji => emoji.name === 'yes');
          const channel = this.client.channels.get("535134548162379787").send(embed)
            .then(function (message) {
              message.react(yes)
              message.react(no)
            });
            reply(`Your suggestion has been sent.`);
          });
      });
    }
  }

module.exports = Suggest;
