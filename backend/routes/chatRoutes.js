const express = require('express');
const router = express.Router();

const ChatController = require('../controllers-mongodb/chatController');
const authMiddleware = require('../middleware/auth-mongodb');

// ==============================
// CHATS
// ==============================

// GET /api/v1/chats - Listar chats do usuário
router.get('/', authMiddleware, ChatController.listarChats);

// POST /api/v1/chats - Criar novo chat (abrir suporte)
router.post('/', authMiddleware, ChatController.criarChat);

// PATCH /api/v1/chats/:chatId/encerrar - Encerrar chat
router.patch('/:chatId/encerrar', authMiddleware, ChatController.encerrarChat);

// ==============================
// MENSAGENS
// ==============================

// GET /api/v1/chats/:chatId/mensagens - Buscar mensagens
router.get('/:chatId/mensagens', authMiddleware, ChatController.listarMensagens);

// POST /api/v1/chats/:chatId/mensagens - Enviar mensagem
router.post('/:chatId/mensagens', authMiddleware, ChatController.enviarMensagem);

module.exports = router;
