import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

// Generate order number
const generateOrderNumber = () => {
  return "ORD-" + Date.now() + Math.floor(Math.random() * 1000);
};

// Create order from cart
export const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      shippingAddress,
    } = req.body;
    
    const userId = req.user._id;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('products.product_id');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Cart is empty",
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cart.products.map(item => {
      const itemTotal = item.product_id.price * item.quantity;
      totalAmount += itemTotal;
      
      return {
        productId: item.product_id._id,
        name: item.product_id.name,
        price: item.product_id.price,
        quantity: item.quantity,
        image: item.product_id.image,
      };
    });

    // Create order
    const order = new Order({
      userId,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "paid", // Fake payment - always successful
      shippingAddress,
    });

    await order.save();

    // Clear cart after successful order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { products: [] } }
    );

    res.status(201).json({
      status: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId })
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findOne({ _id: id, userId })
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid order ID",
      });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({
        status: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Process fake payment
export const processPayment = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv,
      cardholderName,
    } = req.body;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Fake payment validation
    if (cardNumber && cardNumber.length < 16) {
      return res.status(400).json({
        status: false,
        message: "Invalid card number",
      });
    }

    if (cvv && cvv.length < 3) {
      return res.status(400).json({
        status: false,
        message: "Invalid CVV",
      });
    }

    // Always successful for demo
    res.status(200).json({
      status: true,
      message: "Payment processed successfully",
      data: {
        transactionId: "TXN-" + Date.now(),
        amount,
        paymentMethod,
        status: "success",
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Payment processing failed: ${error.message}`,
    });
  }
};