import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Create default admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new User({
      name: "Admin User",
      email: "admin@foodmart.com",
      password: hashedPassword,
      address: "Admin Address",
      role: "admin"
    });

    await admin.save();
    console.log("✅ Default admin user created successfully!");
    console.log("Email: admin@foodmart.com");
    console.log("Password: admin123");
    console.log("⚠️  Please change the password after first login");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createDefaultAdmin();