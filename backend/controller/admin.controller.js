import User from "../models/User.js";
import Product from "../models/product.js";
import Cart from "../models/cart.js";
import mongoose from "mongoose";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalProducts = await Product.countDocuments();
    const totalCarts = await Cart.countDocuments();

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
      role: "user"
    });

    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      status: true,
      message: "Dashboard stats fetched successfully",
      data: {
        totalUsers,
        totalAdmins,
        totalProducts,
        totalCarts,
        recentUsers,
        productsByCategory
      }
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`
    });
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      data: users
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid user ID"
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        status: false,
        message: "Role must be either 'user' or 'admin'"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      status: true,
      message: "User role updated successfully",
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid user ID"
      });
    }

    // Prevent admin from deleting themselves
    if (id === req.user._id.toString()) {
      return res.status(400).json({
        status: false,
        message: "You cannot delete your own account"
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    // Delete the user's cart as well
    await Cart.findOneAndDelete({ userId: id });

    res.status(200).json({
      status: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`
    });
  }
};