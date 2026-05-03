const express = require("express");
const router = express.Router();
const adminController = require("../controllers-mongodb/adminController");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// POST /api/v1/admin/login - Login de administrador
router.post("/login", adminController.login);

// POST /api/v1/admin/criar - Criar novo administrador (requer autenticação)
router.post("/criar", adminAuthMiddleware, adminController.criarAdmin);

// GET /api/v1/admin/listar - Listar administradores (requer autenticação)
router.get("/listar", adminAuthMiddleware, adminController.listarAdmins);

// GET /api/v1/admin/verificar - Verificar token admin (requer autenticação)
router.get("/verificar", adminAuthMiddleware, adminController.verificarToken);

// GET /api/v1/admin/perfil
router.get("/perfil", adminAuthMiddleware, adminController.perfil);

// PUT /api/v1/admin/perfil
router.put("/perfil", adminAuthMiddleware, adminController.atualizarPerfil);

// POST /api/v1/admin/recuperar-senha - Iniciar processo de recuperação de senha
router.post("/recuperar-senha", adminController.recuperarSenha);

// PUT /api/v1/admin/resetar-senha - Resetar senha usando token de recuperação
router.put("/resetar-senha", adminController.resetarSenha);

// PUT /api/v1/admin/alterar-senha - Alterar senha (requer autenticação)
router.put("/alterar-senha", adminAuthMiddleware, adminController.alterarSenha);

module.exports = router;
