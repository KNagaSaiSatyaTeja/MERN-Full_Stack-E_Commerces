import express from "express";
import { 
  getDashboardStats,
  getAllUsersForAdmin,
  updateUserRole,
  deleteUserByAdmin 
} from "../controller/admin.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Dashboard statistics
router.get("/dashboard/stats", getDashboardStats);

// User management
router.get("/users", getAllUsersForAdmin);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUserByAdmin);

export default router;