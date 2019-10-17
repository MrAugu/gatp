const express = require("express");
const Router = express.Router();
const client = require("../../index.js").Client;
const path = require("path");
const Websites = require("../../models/websites.js");
const status = {
  0: "Pending Report",
  1: "Reported",
  2: "Taken Down"
};

Router.get("/", (req, res) => {
  renderTemplate(res, req, "track.ejs", { input: true, data: null, alertRed: null });
});

Router.post("/", async (req, res) => {
  const report = await Websites.findOne({ id: parseInt(req.body.id) });
  if (!report) return renderTemplate(res, req, "track.ejs", { input: true, data: null, alertRed: "Report not found, invalid id." });

  renderTemplate(res, req, "track.ejs", { input: false, data: `Website Url: ${report.url}<br>Report Status: ${status[report.status]}`, alertRed: null });
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

module.exports = Router;
