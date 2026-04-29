const mongoose = require("mongoose");

const Chat = require("../models-mongodb/Chat");
const Message = require("../models-mongodb/Message");

class ChatController {
  // =========================
  // USER - LISTAR CHATS
  // =========================

  static async listarChats(req, res) {
    try {
      const userId = req.user.id;

      const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

      res.json(chats);
    } catch (err) {
      console.log("ERRO LISTAR CHATS:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // USER - CRIAR CHAT
  // =========================

  static async criarChat(req, res) {
    try {
      const userId = req.user.id;

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
  // ADMIN - LISTAR TODOS
  // =========================

  static async listarChatsAdmin(req, res) {
    try {
      const chats = await Chat.find().sort({ updatedAt: -1 });

      res.json(chats);
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // ADMIN - RESPONDER
  // =========================

  static async responderMensagemAdmin(req, res) {
    try {
      const { chatId } = req.params;
      const { texto } = req.body;

      if (!texto) {
        return res.status(400).json({
          error: "Texto obrigatório",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          error: "chatId inválido",
        });
      }

      // 🔥 VALIDA SE CHAT EXISTE
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({
          error: "Chat não encontrado",
        });
      }

      // 🔥 CRIA MENSAGEM ADMIN
      const mensagem = await Message.create({
        chatId,

        texto,

        autor: req.adminId, // correto

        tipo: "admin",
      });

      // 🔥 ATUALIZA CHAT
      chat.updatedAt = new Date();
      await chat.save();

      res.status(201).json(mensagem);
    } catch (err) {
      console.log("ERRO RESPONDER ADMIN:", err);

      res.status(500).json({
        error: err.message,
      });
    }
  }

  // =========================
  // USER - ENCERRAR CHAT
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
        { new: true },
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
        chatId,
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
  // USER - ENVIAR MENSAGEM
  // =========================

  static async enviarMensagem(req, res) {
    try {
      const { chatId } = req.params;
      const { texto } = req.body;

      if (!texto) {
        return res.status(400).json({
          error: "Texto obrigatório",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({
          error: "chatId inválido",
        });
      }

      const mensagem = await Message.create({
        chatId,

        texto,

        autor: req.user.id,

        tipo: "user",
      });

      await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });

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