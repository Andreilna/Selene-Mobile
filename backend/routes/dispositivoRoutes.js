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

// RESUMO DO DISPOSITIVO
router.get("/:id/resumo", authMiddleware, DispositivoController.buscarResumo);

// BUSCA LEITURAS DO DISPOSITIVO
router.get(
  "/:id/leituras",
  authMiddleware,
  DispositivoController.buscarLeituras,
);

// BUSCA UM DISPOSITIVO
router.get("/:id", adminAuthMiddleware, DispositivoController.buscar);

// ATUALIZA DISPOSITIVO
router.put("/:id", adminAuthMiddleware, DispositivoController.atualizar);

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

// DELETA DISPOSITIVO
router.delete("/:id", adminAuthMiddleware, DispositivoController.deletar);

module.exports = router;
