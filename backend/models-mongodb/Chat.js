const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  nome: String,
  status: { type: String, default: "ativo" },
  userId: String
}, { timestamps: true });

module.exports = mongoose.model("Chat", ChatSchema);
