const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  id: { type: String },
  rank: { type: Number },
  rank_name: { type: String }
});

module.exports = mongoose.model("staff", Schema);
