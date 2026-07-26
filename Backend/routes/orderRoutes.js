import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Admin Routes (Put specific paths first)
// ==========================

// Get All Orders
router.get("/", protect, admin, getOrders);

// ==========================
// User Routes
// ==========================

// Create Order
router.post("/", protect, createOrder);

// Logged User Orders
router.get("/user/:id", protect, getUserOrders);

// ==========================
// Single Order & Action Routes (/:id)
// ==========================

// Get Single Order by ID
router.get("/:id", protect, getOrderById);

// Update Status (Admin)
router.patch("/:id/status", protect, admin, updateOrderStatus);

// Delete Order (Admin)
router.delete("/:id", protect, admin, deleteOrder);

export default router;
