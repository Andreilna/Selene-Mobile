const express = require("express");
const router = express.Router();

const chatController = require("../controllers-mongodb/chatController");

const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// ==============================
// ADMIN - CHATS
// ==============================

// ADMIN lista todos
router.get("/chats", adminAuthMiddleware, chatController.listarChatsAdmin);

// ADMIN ver mensagens
router.get(
  "/chats/:chatId/mensagens",
  adminAuthMiddleware,
  chatController.listarMensagens,
);

// ADMIN responder
router.post(
  "/chats/:chatId/mensagens",
  adminAuthMiddleware,
  chatController.responderMensagemAdmin,
);

module.exports = router;
