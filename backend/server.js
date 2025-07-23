import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./routes/user.route.js";
import Product from "./routes/porducts.route.js";
import Cart from "./routes/cart.route.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:5000",
      "http://192.168.1.5:3001","*"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/users", Users);
app.use("/api/products", Product);
app.use("/api/cart", Cart);

mongoose
  .connect(process.env.MONGO_URl)
  .then(() => {
    console.log("connected successfully");
  })
  .then(
    app.listen(process.env.PORT || 5000, () => {
      console.log("conneted to port", process.env.PORT || 5000);
    })
  )
  .catch((err) => {
    console.log("error while connect ", err.message);
  });
