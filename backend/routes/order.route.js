import express from "express";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  processPayment,
} from "../controller/order.controller.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// User routes (require authentication)
router.post("/create", authenticateToken, createOrder);
router.get("/my-orders", authenticateToken, getUserOrders);
router.get("/:id", authenticateToken, getOrderById);

// Payment processing
router.post("/process-payment", authenticateToken, processPayment);

// Admin routes (require admin role)
router.get("/", authenticateToken, requireAdmin, getAllOrders);
router.patch("/:id/status", authenticateToken, requireAdmin, updateOrderStatus);

export default router;