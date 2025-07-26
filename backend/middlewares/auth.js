import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Access token required"
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid token - user not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      status: false,
      message: "Invalid or expired token"
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      status: false,
      message: "Admin access required"
    });
  }
  next();
};