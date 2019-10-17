const Discord = require("discord.js"); // eslint-disable-line no-unused-vars
const Dashboard = require("../dashboard/main.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    this.client.appInfo = await this.client.fetchApplication();
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    await this.client.user.setStatus("dnd");
    await this.client.user.setActivity(`${this.client.guilds.size} Servers | help`)
    this.client.logger.log(`Logged in as ${this.client.user.tag}! Serving ${this.client.guilds.size} Servers and ${this.client.users.size} Users.`, "ready");

    const dash = new Dashboard(this.client);
    if (this.client.readyState !== true) dash.run();
    this.client.readyState = true;
  }
};
