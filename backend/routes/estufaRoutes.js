const express = require('express');
const router = express.Router();
const EstufaController = require('../controllers-mongodb/estufaController');
const authMiddleware = require('../middleware/auth-mongodb');

// GET /api/v1/estufas/listar
router.get('/listar', authMiddleware, EstufaController.listar);

module.exports = router;