const Discord = require("discord.js");
const cooldowns = new Discord.Collection();
const config = require("../config.js");
const pref = config.prefix;
const moment = require("moment");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    if (message.author.bot) return;
    if (message.channel.type !== "text") return message.channel.send(`Bot can not be used in DMs. Use this invite link to invite in a server of your choice`);
    const reply = (c) => message.channel.send(c);

    if (message.guild && !message.channel.permissionsFor(message.guild.me).toArray().includes("SEND_MESSAGES")) return;

    const level = await this.client.permlevel(message);

    if (message.content.indexOf(pref) !== 0) return;

    const args = message.content.slice(pref.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    if (message.guild && !message.member) await message.guild.fetchMember(message.author);
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;
    
    if (level < 9 && this.client.cmdMaintenance === true) return reply("A maintenance on the bot is currently undergoing. Please try again later.");
    if (cmd.conf.enabled === false) return;

    if (cmd.conf.args === true && !args.length) {
      return reply(`You did not provide the correct arguments.\nCorrect Usage: \`${cmd.help.name} ${cmd.help.usage}\``);
    }

    if (!cooldowns.has(cmd.help.name)) {
      cooldowns.set(cmd.help.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.help.name);
    const cooldownAmount = cmd.conf.cooldown * 1000;

    if (message.author.id !== "." && message.author.id !== ".") {
      if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return reply(`You are currently on cooldown. You have to wait ${timeLeft.toFixed(1)} seconds before using \`${cmd.help.name}\` again.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    }

    if (level < this.client.levelCache[cmd.conf.permLevel]) return reply("You do not have required permission to use this command.");

    message.author.permLevel = level;

    try {
      await cmd.run(message, args, level, reply);
    } catch (e) {
      reply(`Internal error occured! Error: \`${e}\``);
    }
  }
};
