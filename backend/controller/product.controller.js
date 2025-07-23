import mongoose from "mongoose";
import Product from "../models/product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "Products is empty",
      });
    }
    res.status(200).json({
      success: true,
      data: [...products],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error" + error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;

  if (
    !product.name ||
    !product.price ||
    !product.category ||
    !product.description
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }
  const imagePath = req.file
    ? `http://localhost:5000/uploads/products/${req.file.filename}`
    : "";
  const newProduct = new Product({
    name: product.name,
    price: parseInt(product.price),
    category: product.category,
    description: product.description,
    image: imagePath,
  });

  try {
    await newProduct.save();
    const productResponse = newProduct.toObject();
    delete productResponse.password;
    res.status(201).json({
      success: true,
      data: productResponse,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Server Error${error.message}`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Product ID",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  console.log(product);
  if (product.name == "" || product.price == "" || product.image == "") {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields",
    });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, product, {
      new: true,
    });
    console.log(updatedProduct);
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
