const mongoose = require("mongoose");

const ConvoSchema = new mongoose.Schema({
  menbers: {},
  content: { type: String, required: true },
  time: { type: String, required: true },
});

const Convo = mongoose.model("Convo", ConvoSchema);

module.exports = { Convo };
