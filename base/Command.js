class Command {
  constructor (client, {
    name = null,
    description = "No description has been provided.",
    category = "No category has been provided.",
    usage = "No usage has been provided.",
    enabled = true,
    aliases = new Array(),
    permLevel = "User",
    cooldown = 3,
    args = false,
    rank = "User"
  }) {
    this.client = client;
    this.conf = { enabled, aliases, permLevel, cooldown, args, rank };
    this.help = { name, description, category, usage };
  }
}

module.exports = Command;
