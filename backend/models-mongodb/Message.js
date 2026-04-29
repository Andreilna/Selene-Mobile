import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  texto: String,
  autor: String
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);
