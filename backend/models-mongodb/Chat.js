import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  nome: String,
  status: { type: String, default: "ativo" },
  userId: String
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema);
