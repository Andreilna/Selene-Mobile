const express = require("express");
const router = express.Router();
const EstufaController = require("../controllers-mongodb/estufaController");
const authMiddleware = require("../middleware/auth-mongodb");

// Rota para listar todas (GET /api/v1/estufas/listar)
router.get("/listar", authMiddleware, EstufaController.listar);

// Rota para cadastrar (POST /api/v1/estufas/cadastrar)
router.post("/cadastrar", authMiddleware, EstufaController.cadastrar);

// Rota para buscar uma específica (GET /api/v1/estufas/detalhes/:id)
// ATENÇÃO: Verifique se escreveu "detalhes" (plural) e se tem os ":" antes do id
router.get("/detalhes/:id", authMiddleware, EstufaController.buscarPorId);

module.exports = router;
