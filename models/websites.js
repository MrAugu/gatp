const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: Number },
  url: { type: String },
  host: { type: String },
  game: { type: String },
  timestamp: { type: Number },
  status: { type: Number, default: 0 }
});

module.exports = mongoose.model("websites", Schema);
