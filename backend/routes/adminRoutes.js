const express = require("express");
const router = express.Router();

const AdminController = require("../controllers-mongodb/adminController");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// ==========================================
// LOGIN (público)
// ==========================================
router.post("/login", AdminController.login);

// ==========================================
// CRIAR ADMIN (somente SUPERADMIN)
// ==========================================
router.post(
  "/criar",
  adminAuthMiddleware,
  (req, res, next) => {
    if (req.admin?.nivel !== "superadmin") {
      return res.status(403).json({
        success: false,
        message: "Apenas superadmin pode criar administradores",
      });
    }
    next();
  },
  AdminController.criarAdmin,
);

// ==========================================
// LISTAR ADMINS (autenticado)
// ==========================================
router.get("/listar", adminAuthMiddleware, AdminController.listarAdmins);

// ==========================================
// PERFIL ADMIN
// ==========================================
router.get("/perfil", adminAuthMiddleware, AdminController.perfil);

router.put("/perfil", adminAuthMiddleware, AdminController.atualizarPerfil);

// ==========================================
// VERIFICAR TOKEN
// ==========================================
router.get("/verificar", adminAuthMiddleware, AdminController.verificarToken);

// ==========================================
// SENHA
// ==========================================

// recuperação (público)
router.post("/recuperar-senha", AdminController.recuperarSenha);

// reset via token (público controlado por token)
router.put("/resetar-senha", AdminController.resetarSenha);

// alteração (logado)
router.put("/alterar-senha", adminAuthMiddleware, AdminController.alterarSenha);

module.exports = router;
