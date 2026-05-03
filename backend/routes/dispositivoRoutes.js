const express = require("express");
const router = express.Router();

const DispositivoController = require("../controllers-mongodb/dispositivoController");
const authMiddleware = require("../middleware/auth-mongodb");
const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");

// 👤 USER
router.get("/", authMiddleware, DispositivoController.listar);
router.get("/:id", authMiddleware, DispositivoController.buscar);

// 🔥 ADMIN CRIA
router.post("/", adminAuthMiddleware, DispositivoController.criar);

// 👤 USER
router.put("/:id", authMiddleware, DispositivoController.atualizar);

router.patch(
  "/:id/status",
  authMiddleware,
  DispositivoController.atualizarStatus
);

router.put(
  "/:id/ativo",
  authMiddleware,
  DispositivoController.alterarStatusDispositivo
);

module.exports = router;