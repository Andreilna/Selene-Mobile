const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/auth-mongodb");
const userController = require("../controllers-mongodb/userController");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// 👇 CRIAR USUÁRIO (CADASTRO)
router.post("/", adminAuthMiddleware, userController.criar);

// 👇 ping
router.post("/ping", AuthMiddleware, userController.ping);

// 👇 perfil
router.get("/me", AuthMiddleware, userController.perfil);

// 👇 atualizar perfil
router.put("/me", AuthMiddleware, userController.atualizarPerfil);

// 🔥 LISTAR USUÁRIOS (ADMIN)
router.get("/", adminAuthMiddleware, userController.listar);

// 👇 buscar usuário por id (ADMIN)
router.get("/:id", adminAuthMiddleware, userController.buscarPorId);

// 👇 atualizar usuário por id (ADMIN)
router.put("/:id", adminAuthMiddleware, userController.atualizarPorId);

// 
router.delete("/:id", adminAuthMiddleware, userController.deletarPorId);

module.exports = router;