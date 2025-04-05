import express from "express";
import {
  addToCart,
  clearCart,
  deleteSelectedProducts,
  getCart,
  removeFromCart,
} from "../controller/cart.controller.js";

const route = express.Router();

route.get("/:userId", getCart);
route.post("/create", addToCart);
route.delete("/:userId", clearCart);
route.delete("/removeFromCart", removeFromCart);
route.delete("/deleteSelectedPorducte", deleteSelectedProducts);

export default route;
