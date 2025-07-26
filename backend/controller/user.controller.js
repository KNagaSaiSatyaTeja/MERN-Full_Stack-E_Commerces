import mongoose from "mongoose";
import User from "../models/User.js";
import Cart from "../models/cart.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const postUSer = async (req, res) => {
  const body = req.body;

  try {
    const existsUser = await User.findOne({ email: body.email });
    if (existsUser) {
      return res.status(401).json({
        status: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    const imagePath = req.file
      ? `http://localhost:5000/uploads/users/${req.file.filename}`
      : "";

    const newUser = new User({
      name: body.name,
      address: body.address,
      email: body.email,
      password: hashedPassword,
      image: imagePath,
      role: body.role || "user" // Allow role assignment, default to user
    });

    await newUser.save();
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      status: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// New login function
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required"
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password"
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data without password
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      status: true,
      message: "Login successful",
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`
    });
  }
};
export const getAllUser = async (req, res) => {
  const allUsers = await User.find();
  if (!allUsers) {
    return res.status(400).json({
      status: false,
      message: "error while fetching users",
    });
  }
  res.status(200).json({
    status: true,
    message: "successfully fetched users",
    allUsers,
  });
};
export const editUser = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const body = req.body;
  if (!body.name || !body.address) {
    return res.status(400).json({
      status: false,
      message: "User need all the fields",
    });
  }
  const updatedUSer = await User.findByIdAndUpdate(id, body, { new: true });
  if (updatedUSer) {
    return res.status(200).json({
      status: true,
      message: "user updated ",
      data: updatedUSer,
    });
  }
  res.status(400).json({
    status: false,
    message: "failed to update",
  });
};
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  // Validate the provided ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      status: false,
      message: "Invalid ID format",
    });
  }

  try {
    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Delete the user's cart
    await Cart.findOneAndDelete({ userId: id });

    return res.status(200).json({
      status: true,
      message: "User and associated cart deleted successfully",
    });
  } catch (error) {
    // Handle server errors
    return res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};
export const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      status: false,
      message: "please provide user id",
    });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).json({
      status: false,
      message: "error while fetching user",
    });
  }
  res.status(200).json({
    status: true,
    message: "successfully fetched user",
    data: user,
  });
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({
        status: false,
        message: "please provide email",
      });
    }
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "error while fetching user",
      });
    }
    res.status(200).json({
      status: true,
      message: "successfully fetched user",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `Server error: ${error.message}`,
    });
  }
};
