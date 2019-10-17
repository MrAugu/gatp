const express = require("express");
const Router = express.Router();
const client = require("../../index.js").Client;
const path = require("path");

Router.get("/", (req, res) => {
  renderTemplate(res, req, "index.ejs");
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
