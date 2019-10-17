const express = require("express");
const Router = express.Router();
const client = require("../../index.js").Client;
const path = require("path");
const games = {
  "1": "Growtopia"
};
const Websites = require("../../models/websites.js");

Router.get("/", (req, res) => {
  renderTemplate(res, req, "report.ejs", { alertRed: null, alertGreen: null });
});

Router.post("/", async (req, res) => {
  if (!isUrl(req.body.url)) renderTemplate(res, req, "report.ejs", { alertRed: "Invalid URL specified.", alertGreen: null });

  const count = await Websites.countDocuments();

  await (new Websites({
    id: count + 1,
    url: `${req.body.url.startsWith("http") || req.body.url.startsWith("www") ? "http://" : ""}${req.body.url}`,
    host: req.body.host.length < 3 ? null : req.body.host,
    game: games[req.body.game],
    timestamp: Date.now()
  }).save()).catch(e => console.error(e));

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
