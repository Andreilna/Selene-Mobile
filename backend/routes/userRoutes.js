const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/auth-mongodb");
const userController = require("../controllers-mongodb/userController");

// 👇 ping
router.post("/ping", AuthMiddleware, UserController.ping);

// 👇 perfil
router.get("/me", AuthMiddleware, UserController.perfil);

// 👇 atualizar perfil
router.put("/me", AuthMiddleware, UserController.atualizarPerfil);

// 🔥 LISTAR USUÁRIOS (ADMIN)
router.get("/", AuthMiddleware, UserController.listar);

module.exports = router;