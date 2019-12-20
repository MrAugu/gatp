const Discord = require("discord.js");
const url = require("url");
const path = require("path");
const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const Strategy = require("passport-discord").Strategy;
const helmet = require("helmet");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {
    const rootDirectory = path.resolve(`${process.cwd()}${path.sep}dashboard`);
    const templateDirectory = path.resolve(`${rootDirectory}${path.sep}templates`);
    app.use("/assets", express.static(path.resolve(`${rootDirectory}${path.sep}assets`)));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj, done) => {
      done(null, obj);
    });

    passport.use(new Strategy({
      clientID: this.client.appInfo.id,
      clientSecret: this.client.config.dashboard.clientSecret,
      callbackURL: this.client.config.dashboard.callbackURL,
      scope: ["identify", "guilds"]
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => done(null, profile));
    }));

    app.use(session({
      store: new MemoryStore({ checkPeriod: 86400000 }),
      secret: this.client.config.dashboard.sessionSecret,
      resave: false,
      saveUninitialized: false,
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(helmet());
    app.locals.domain = this.client.config.dashboard.domain;
    app.engine("html", require("ejs").renderFile);
    app.set("view engine", "html");
    var bodyParser = require("body-parser");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    const checkAuth = (req, res, next) => {
      if (req.isAuthenticated()) return next();
      req.session.backURL = req.url;
      res.redirect("/login");
    };

    app.get("/login", (req, res, next) => {
      if (req.session.backURL) {
        req.session.backURL = req.session.backURL; // eslint-disable-line no-self-assign
      } else if (req.headers.referer) {
        const parsed = url.parse(req.headers.referer);
        if (parsed.hostname === app.locals.domain) {
          req.session.backURL = parsed.path;
        }
      } else {
        req.session.backURL = "/";
      }
      next();
    }, passport.authenticate("discord"));

    app.get("/callback", passport.authenticate("discord", { failureRedirect: "/login-failure" }), (req, res) => {
      session.us = req.user;
      if (req.user.id === this.client.appInfo.owner.id || this.client.config.admins.includes(req.user.id)) {
        req.session.isAdmin = true;
      } else {
        req.session.isAdmin = false;
      }
      if (req.session.backURL) {
        const url = req.session.backURL;
        req.session.backURL = null;
        res.redirect(url);
      } else {
        res.redirect("/");
      }
    });

    app.get("/logout", (req, res) => {
      req.session.destroy(() => {
        req.logout();
        res.redirect("/");
      });
    });

    const indexPage = require("./routers/index.js");
    const reportPage = require("./routers/report.js");
    const trackPage = require("./routers/track.js");
    const apiRoutes = require("./routers/api.js");
    
    app.use("/", indexPage);
    app.use("/report", reportPage);
    app.use("/track", trackPage);
    app.use("/api", apiRoutes);
    
    this.client.dash = app.listen(this.client.config.dashboard.port, null, null, () => console.log("Dashboard fully loaded."));
  }
};
