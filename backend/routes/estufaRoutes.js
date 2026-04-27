const express = require('express');
const router = express.Router();
const EstufaController = require('../controllers-mongodb/estufaController');
const authMiddleware = require('../middleware/auth-mongodb');

// ROTA 1: Para a tela de listagem puxar os dados
router.get('/listar', authMiddleware, EstufaController.listar);

// ROTA 2: Para a tela de nova-estufa salvar os dados
router.post('/cadastrar', authMiddleware, EstufaController.cadastrar);

module.exports = router;