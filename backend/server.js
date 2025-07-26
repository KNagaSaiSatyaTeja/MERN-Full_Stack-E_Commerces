import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./routes/user.route.js";
import Product from "./routes/porducts.route.js";
import Cart from "./routes/cart.route.js";
import Admin from "./routes/admin.route.js";
import Order from "./routes/order.route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      process.env.FRONTEND_URL || "http://localhost:3000",
      "*",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", Users);
app.use("/api/products", Product);
app.use("/api/cart", Cart);
app.use("/api/admin", Admin);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.log("❌ Error while connecting to MongoDB:", err.message);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌐 API available at http://localhost:${PORT}/api`);
});
