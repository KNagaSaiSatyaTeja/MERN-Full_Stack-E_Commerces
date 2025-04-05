import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Users from "./routes/user.route.js";
import Product from "./routes/porducts.route.js";
import Cart from "./routes/cart.route.js";
import multer from "multer";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api/user", Users);
app.use("/api/product", Product);
app.use("/api/cart", Cart);

mongoose
  .connect(process.env.MONGO_URl)
  .then(() => {
    console.log("connected successfully");
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log("conneted to port 3000");
    })
  )
  .catch((err) => {
    console.log("error while connect ", err.message);
  });
