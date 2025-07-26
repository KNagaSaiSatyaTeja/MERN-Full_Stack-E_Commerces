import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/product.controller.js";
import { productUpload } from "../middlewares/multer/multer.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validators/productValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { authenticateToken, requireAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Public route - anyone can view products
router.get("/", getAllProducts);

// Admin only routes - require authentication and admin role
router.post(
  "/create",
  authenticateToken,
  requireAdmin,
  productUpload.single("image"),
  createProductValidator,
  validateRequest,
  createProduct
);

router.put(
  "/update/:id",
  authenticateToken,
  requireAdmin,
  productUpload.single("image"),
  updateProductValidator,
  validateRequest,
  updateProduct
);

router.delete("/delete/:id", authenticateToken, requireAdmin, deleteProduct);

export default router;
