const express = require("express");
const router = express.Router();

const AuthMiddleware = require("../middlewares/authMiddleware");
const UserController = require("../controllers-mongodb/UserController");

// 👇 ping (ONLINE STATUS)
router.post("/ping", AuthMiddleware, UserController.ping);

// 👇 perfil
router.get("/me", AuthMiddleware, UserController.perfil);

// 👇 update profile
router.put("/me", AuthMiddleware, UserController.atualizarPerfil);

module.exports = router;
