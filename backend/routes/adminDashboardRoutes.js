const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");
const adminDashboardController = require("../controllers-mongodb/adminDashboardController");

// 📊 STATS GERAIS DO SISTEMA (ADMIN)
router.get("/stats", adminAuthMiddleware, adminDashboardController.stats);

// 🏠 DASHBOARD PRINCIPAL ADMIN
router.get("/home", adminAuthMiddleware, adminDashboardController.home);

module.exports = router;