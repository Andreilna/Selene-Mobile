const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middleware/auth-mongodb");
const userController = require("../controllers-mongodb/userController");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// 👇 ping
router.post("/ping", AuthMiddleware, userController.ping);

// 👇 perfil
router.get("/me", AuthMiddleware, userController.perfil);

// 👇 atualizar perfil
router.put("/me", AuthMiddleware, userController.atualizarPerfil);

// 🔥 LISTAR USUÁRIOS (ADMIN)
router.get("/", adminAuthMiddleware, userController.listar);

module.exports = router;