const express = require("express");
const router = express.Router();

const chatController = require("../controllers-mongodb/chatController");

const authMiddleware = require("../middleware/auth-mongodb");

// ==============================
// CHATS (USUÁRIO)
// ==============================

// GET /api/v1/chats
router.get("/", authMiddleware, chatController.listarChats);

// POST /api/v1/chats
router.post("/", authMiddleware, chatController.criarChat);

// PATCH encerrar
router.patch("/:chatId/encerrar", authMiddleware, chatController.encerrarChat);

// ==============================
// MENSAGENS
// ==============================

// GET mensagens
router.get(
  "/:chatId/mensagens",
  authMiddleware,
  chatController.listarMensagens,
);

// POST mensagem USER
router.post(
  "/:chatId/mensagens",
  authMiddleware,
  chatController.enviarMensagem,
);

module.exports = router;