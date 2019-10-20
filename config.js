const config = {
    "token":  "NjM0MTAxMDk0OTA1MDIwNDM2.XahySQ.4Z2HJ1fvXtSMsvg9pExkEuTBJiQ",
    "prefix": "=",
    "owner": "",
    "admins": [],
    "operators": [],
    "dbUrl": "mongodb+srv://bot:bot--1@bot-wlsbg.mongodb.net/gtpp?retryWrites=true&w=majority",

    "emojis": {
      "redTick": ":x:",
      "greenTick": ":white_check_mark:"
    },

    "dashboard": {
      "clientSecret": "RzIuoMNtwVLz2J2TZkvSZObFmRDC0dTG",
      "callbackURL": "http://localhost/callback",
      "sessionSecret": "EFRF@F@EE@FT$TT#%Y$#$#$@%#@$#RR@GFTG$W@TGTGWFWFRW",
      "domain": "localhost",
      "port": 7060
    },

    permLevels: [
      { level: 0,
        name: "User",
        check: () => true
      },

      { level: 2,
        name: "Moderator",
        check: (message) => {
          try {
            if (message.member.hasPermission("MANAGE_MESSAGES") || message.member.hasPermission("MANAGE_GUILD") ||  message.member.roles.get(message.guild.settings.moderator_role) !== undefined) {
              return true;
            } else {
              return false;
            }
          } catch (e) {
            return false;
          }
        }
      },

      { level: 3,
        name: "Administrator",
        check: (message) => {
          try {
            if (message.member.hasPermission("ADMINISTRATOR") ||  message.member.roles.get(message.guild.settings.administrator_role) !== undefined) {
              return true;
            } else {
              return false;
            }
          } catch (e) {
            return false;
          }
        }
      },

      { level: 4,
        name: "Server Owner",
        check: (message) => {
          if (message.channel.type === "text" && message.guild.ownerID) {
            if (message.guild.ownerID === message.author.id) return true;
          } else {
            return false;
          }
        }
      },

      { level: 5,
        name: "Support Operator",
        check: (message) => config.operators.includes(message.author.id)
      },

      { level: 9,
        name: "Bot Admin",
        check: (message) => config.admins.includes(message.author.id)
      },

      { level: 10,
        name: "Bot Owner",
        check: (message) => "414764511489294347" === message.author.id
      }
    ]
  };

  module.exports = config;
