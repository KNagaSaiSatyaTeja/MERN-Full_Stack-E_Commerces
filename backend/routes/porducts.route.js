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

const router = express.Router();

router.get("/", getAllProducts);

router.post(
  "/create",
  productUpload.single("image"),
  createProductValidator,
  validateRequest,
  createProduct
);

router.put(
  "/update/:id",
  productUpload.single("image"),
  updateProductValidator,
  validateRequest,
  updateProduct
);

router.delete("/delete/:id", deleteProduct);

export default router;
