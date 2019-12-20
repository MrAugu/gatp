const express = require("express");
const Router = express.Router();
const client = require("../../index.js").Client;
const path = require("path");
const games = {
  "1": "Growtopia"
};
const Websites = require("../../models/websites.js");
const Discord = require("discord.js");

Router.get("/", async (req, res) => {
  const count = await Websites.countDocuments({ status: 2 });

  renderTemplate(res, req, "report.ejs", { alertRed: null, alertGreen: null, amount: count });
});

Router.post("/", async (req, res) => {
  if (!isUrl(req.body.url)) return renderTemplate(res, req, "report.ejs", { alertRed: "Invalid link specified.", alertGreen: null });
  const count = await Websites.countDocuments();
  if (!req.body.url.startsWith("http")) req.body.url = `http://${req.body.url}`;

  var isReported = await Websites.findOne({ url: req.body.url });
  if (isReported && isReported.status === 2) isReported = undefined;

  if (isReported) return renderTemplate(res, req, "report.ejs", { alertRed: "That link has been already reported by someone else.", alertGreen: null });

  await (new Websites({
    id: count + 1,
    url: `${req.body.url}`,
    host: req.body.host.length < 3 ? null : req.body.host,
    game: games[req.body.game],
    timestamp: Date.now()
  }).save()).catch(e => console.error(e));

  const embed = new Discord.MessageEmbed()
    .setAuthor("GAPT", client.user.displayAvatarURL())
    .setTitle("New Report")
    .setDescription(`Website: ${req.body.url}\nHosted On: ${(req.body.host.length < 3 ? null : req.body.host) === null ? "Not Specified" : (req.body.host.length < 3 ? null : req.body.host)}\nGame: ${games[req.body.game]}\nCase ID: ${count + 1}`)
    .setColor("RED")
    .setTimestamp();
  client.channels.get("536531331903913985").send(embed);

  renderTemplate(res, req, "report.ejs", { alertRed: null, alertGreen: "Reported!<br>Report ID: <strong>" + (count + 1) + "</strong> (You can use it to track your report.)" });
});

function renderTemplate (res, req, template, data = {}) {
  const rootDirectory = path.resolve(`${process.cwd()}${path.sep}dashboard`);
  const templateDirectory = path.resolve(`${rootDirectory}${path.sep}templates`);

  const baseData = {
    bot: client,
    path: req.path,
    user: req.isAuthenticated() ? req.user : null
  };
  res.render(path.resolve(`${templateDirectory}${path.sep}${template}`), Object.assign(baseData, data));
};

function isUrl (str) {
  var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
  return regex.exec(str);
}

module.exports = Router;
