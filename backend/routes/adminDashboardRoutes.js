const express = require("express");
const router = express.Router();

const adminAuthMiddleware = require("../middleware/admin-auth-mongodb");
const AdminDashboardController = require("../controllers-mongodb/AdminDashboardController");

// 📊 STATS GERAIS DO SISTEMA (ADMIN)
router.get("/stats", adminAuthMiddleware, AdminDashboardController.stats);

// 🏠 DASHBOARD PRINCIPAL ADMIN
router.get("/home", adminAuthMiddleware, AdminDashboardController.home);

module.exports = router;