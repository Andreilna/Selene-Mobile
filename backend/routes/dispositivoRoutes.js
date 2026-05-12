const express = require("express");
const router = express.Router();

const DispositivoController = require("../controllers-mongodb/dispositivoController");

const authMiddleware = require("../middleware/auth-mongodb");

const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// ==========================================
// USER
// ==========================================

// LISTA DISPOSITIVOS DO USUÁRIO
router.get("/meus", authMiddleware, DispositivoController.listar);

// BUSCA UM DISPOSITIVO
router.get("/:id", authMiddleware, DispositivoController.buscar);

// ATUALIZA DISPOSITIVO
router.put("/:id", authMiddleware, DispositivoController.atualizar);

// ATUALIZA STATUS
router.patch(
  "/:id/status",
  authMiddleware,
  DispositivoController.atualizarStatus,
);

// ALTERA ATIVO
router.put(
  "/:id/ativo",
  authMiddleware,
  DispositivoController.alterarStatusDispositivo,
);

// ==========================================
// ADMIN
// ==========================================

// LISTA TODOS OS DISPOSITIVOS
router.get("/", adminAuthMiddleware, DispositivoController.listarTodos);

// CRIA DISPOSITIVO
router.post("/", adminAuthMiddleware, DispositivoController.criar);

// BUSCA LEITURAS DO DISPOSITIVO
router.get(
  "/:id/leituras",
  adminAuthMiddleware,
  DispositivoController.buscarLeituras
);

// DELETA DISPOSITIVO
router.delete("/:id", adminAuthMiddleware, DispositivoController.deletar);

module.exports = router;  
