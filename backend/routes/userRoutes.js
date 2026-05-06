const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/auth-mongodb");
const userController = require("../controllers-mongodb/userController");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// 👇 CRIAR USUÁRIO (CADASTRO) - ADMIN
router.post("/", adminAuthMiddleware, userController.criar);

// 👇 ping
router.post("/ping", AuthMiddleware, userController.ping);

// 👇 perfil do usuário logado
router.get("/me", AuthMiddleware, userController.perfil);

// 👇 atualizar perfil do usuário logado
router.put("/me", AuthMiddleware, userController.atualizarPerfil);

// 🔥 LISTAR USUÁRIOS (ADMIN)
router.get("/", adminAuthMiddleware, userController.listar);

// 👤 BUSCAR USUÁRIO POR ID (ADMIN)
router.get("/:id", adminAuthMiddleware, userController.buscarPorId);

// ✏️ ATUALIZAR USUÁRIO POR ID (ADMIN)
router.put("/:id", adminAuthMiddleware, userController.atualizar);

// 🗑️ DELETAR USUÁRIO (ADMIN)
router.delete("/:id", adminAuthMiddleware, userController.deletar);

module.exports = router;