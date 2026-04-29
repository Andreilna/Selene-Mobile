const Chat = require('../models-mongodb/Chat');
const Message = require('../models-mongodb/Message');

class ChatController {

  static async listarChats(req, res) {
    try {
      const userId = req.user.id;

      const chats = await Chat.find({ userId })
        .sort({ updatedAt: -1 });

      res.json(chats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async criarChat(req, res) {
    try {
      const userId = req.user.id;

      const chat = await Chat.create({
        userId,
        nome: 'Suporte',
        status: 'ativo'
      });

      res.status(201).json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async encerrarChat(req, res) {
    try {
      const { chatId } = req.params;

      const chat = await Chat.findByIdAndUpdate(
        chatId,
        { status: 'encerrado' },
        { new: true }
      );

      res.json(chat);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async listarMensagens(req, res) {
    try {
      const { chatId } = req.params;

      const mensagens = await Message.find({ chatId })
        .sort({ createdAt: 1 });

      res.json(mensagens);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async enviarMensagem(req, res) {
    try {
      const { chatId } = req.params;
      const { texto } = req.body;

      const mensagem = await Message.create({
        chatId,
        texto,
        autor: req.user.id
      });

      await Chat.findByIdAndUpdate(chatId, {
        updatedAt: new Date()
      });

      res.status(201).json(mensagem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ChatController;