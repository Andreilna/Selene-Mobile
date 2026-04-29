const mongoose = require("mongoose");
const Chat = require("../models-mongodb/Chat");
const Message = require("../models-mongodb/Message");

class ChatController {

  // =========================
  // LISTAR CHATS
  // =========================

  static async listarChats(req, res) {
    try {
      const userId = req.user.id;

      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 });

      res.json(chats);

    } catch (err) {

      console.log("ERRO LISTAR CHATS:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // CRIAR CHAT (SEM DUPLICAR)
  // =========================

  static async criarChat(req, res) {
    try {

      const userId = req.user.id;

      // evita duplicação
      const chatExistente = await Chat.findOne({
        userId,
        status: "ativo",
      });

      if (chatExistente) {
        return res.json(chatExistente);
      }

      const chat = await Chat.create({
        userId,
        nome: "Suporte",
        status: "ativo",
      });

      res.status(201).json(chat);

    } catch (err) {

      console.log("ERRO CRIAR CHAT:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // ENCERRAR CHAT
  // =========================

  static async encerrarChat(req, res) {
    try {

      const { chatId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          error: "chatId inválido",
        });
      }

      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { status: "encerrado" },
        { new: true }
      );

      if (!chat) {
        return res.status(404).json({
          error: "Chat não encontrado",
        });
      }

      res.json(chat);

    } catch (err) {

      console.log("ERRO ENCERRAR CHAT:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // LISTAR MENSAGENS
  // =========================

  static async listarMensagens(req, res) {
    try {

      const { chatId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          error: "chatId inválido",
        });
      }

      const mensagens = await Message.find({
        chatId: chatId,
      }).sort({ createdAt: 1 });

      res.json(mensagens);

    } catch (err) {

      console.log("ERRO LISTAR MENSAGENS:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // ENVIAR MENSAGEM
  // =========================

  static async enviarMensagem(req, res) {
    try {

      const { chatId } = req.params;
      const { texto } = req.body;

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          error: "chatId inválido",
        });
      }

      if (!texto || texto.trim() === "") {
        return res.status(400).json({
          error: "Texto vazio",
        });
      }

      // verifica se chat existe
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          error: "Chat não encontrado",
        });
      }

      const mensagem = await Message.create({
        chatId,
        texto,
        autor: req.user.id,
      });

      // atualiza data do chat
      await Chat.findByIdAndUpdate(chatId, {
        updatedAt: new Date(),
      });

      res.status(201).json(mensagem);

    } catch (err) {

      console.log("ERRO ENVIAR MSG:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }
}

module.exports = ChatController;