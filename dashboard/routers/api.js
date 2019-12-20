const express = require("express");
const Router = express.Router();
const client = require("../../index.js").Client;
const path = require("path");
const games = {
  "1": "Growtopia"
};
const Websites = require("../../models/websites.js");
const Discord = require("discord.js");

Router.post("/report/growcord", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (!isUrl(req.body.url)) return res.status(400).send(JSON.stringify({ "msg": "Bad Request.", "code": 400, "error": "No url was found within the reuqest body.", "errorCode": "NO_URL" }, null, 4));
  const count = await Websites.countDocuments();
  if (!req.body.url.startsWith("http")) req.body.url = `http://${req.body.url}`;

  var isReported = await Websites.findOne({ url: req.body.url });
  if (isReported && isReported.status === 2) isReported = false;

  if (isReported) res.status(501).send(JSON.stringify({ "msg": "Already reported.", "code": 501, "error": "The url in the body was already reported by someone else.", "errorCode": "ALREADY_REPORTED" }, null, 4));

  await (new Websites({
    id: count + 1,
    url: `${req.body.url}`,
    host: req.body.host.length < 3 ? null : req.body.host,
    game: games[req.body.game],
    timestamp: Date.now()
  }).save()).catch(e => console.error(e));

  const embed = new Discord.MessageEmbed()
    .setAuthor("GAPT <:partner:657649043689832458> GrowCord", client.user.displayAvatarURL())
    .setTitle("New Report By GrowCord")
    .setDescription(`Website: ${req.body.url}\nHosted On: ${(req.body.host.length < 3 ? null : req.body.host) === null ? "Not Specified" : (req.body.host.length < 3 ? null : req.body.host)}\nGame: ${games[req.body.game]}\nCase ID: ${count + 1}`)
    .setColor("RED")
    .setTimestamp();
  client.channels.get("536531331903913985").send(embed);

  res.status(200).send(JSON.stringify({ "msg": "Reported!", "code": 200 }, null, 4));
});

function isUrl (str) {
  var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
  return regex.exec(str);
}

module.exports = Router;
