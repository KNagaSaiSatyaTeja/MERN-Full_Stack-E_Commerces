import Cart from "../models/cart.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
  const { userId, products } = req.body;
  if (!userId || !products) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId and productId",
    });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      products.forEach((product) => {
        const productIndex = cart.products.findIndex(
          (item) => item.product_id.toString() === product.product_id
        );
        if (productIndex > -1) {
          cart.products[productIndex].quantity += product.quantity;
        } else {
          cart.products.push(product);
        }
      });
      await cart.save();
    } else {
      const newCart = new Cart({
        userId,
        products,
      });
      await newCart.save();
      return res.status(201).json({
        success: true,
        message: "Cart created and product added",
        data: newCart,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

export const getCart = async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId",
    });
  }

  // Check if userId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid userId format",
    });
  }

  try {
    // Fetch the cart and populate product details
    const cart = await Cart.findOne({ userId }).populate("products.product_id");
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Return the cart data
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      success: false,
      message: `Server Error: ${error.message}`,
    });
  }
};

export const removeFromCart = async (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId and productId",
    });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product_id.toString() === productId
    );
    if (productIndex > -1) {
      cart.products[productIndex].quantity -= 1;
      if (cart.products[productIndex].quantity === 0) {
        cart.products.splice(productIndex, 1);
      }
      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Product removed from cart",
        data: cart,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Server Error ${error.message}`,
    });
  }
};

export const clearCart = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId",
    });
  }

  try {
    const cart = await Cart.findOneAndDelete({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteSelectedProducts = async (req, res) => {
  const { userId, productIds } = req.body;
  if (!userId || !productIds || !Array.isArray(productIds)) {
    return res.status(400).json({
      success: false,
      message: "Please provide userId and an array of productIds",
    });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.products = cart.products.filter(
      (product) => !productIds.includes(product.product_id.toString())
    );
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Selected products removed from cart",
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
