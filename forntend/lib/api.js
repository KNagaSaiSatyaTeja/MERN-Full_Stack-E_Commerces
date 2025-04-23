"use client";

// This is a mock API service that simulates API calls
// In a real application, this would be replaced with actual API calls

// Mock product data
import axios from "axios";
import { Key } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Organic Apples",
    category: "Fruits",
    price: 4.99,
    oldPrice: 6.99,
    discount: 28,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 128,
    description:
      "Fresh organic apples picked from local farms. Perfect for snacking or baking.",
    inStock: true,
  },
  {
    id: 2,
    name: "Fresh Avocados",
    category: "Fruits",
    price: 7.99,
    oldPrice: 0,
    discount: 0,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 89,
    description:
      "Ripe and ready-to-eat avocados. Great for guacamole or avocado toast.",
    inStock: true,
  },
  {
    id: 3,
    name: "Organic Carrots",
    category: "Vegetables",
    price: 2.49,
    oldPrice: 3.49,
    discount: 29,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 56,
    description:
      "Organic carrots that are sweet and crunchy. Perfect for salads or snacking.",
    inStock: true,
  },
  {
    id: 4,
    name: "Premium Beef Steak",
    category: "Meat",
    price: 19.99,
    oldPrice: 24.99,
    discount: 20,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 42,
    description: "Premium cut beef steak, grass-fed and hormone-free.",
    inStock: true,
  },
  {
    id: 5,
    name: "Fresh Atlantic Salmon",
    category: "Seafood",
    price: 15.99,
    oldPrice: 0,
    discount: 0,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 37,
    description: "Wild-caught Atlantic salmon, rich in omega-3 fatty acids.",
    inStock: true,
  },
  {
    id: 6,
    name: "Artisan Sourdough Bread",
    category: "Bakery",
    price: 5.99,
    oldPrice: 0,
    discount: 0,
    image: "/placeholder.svg?height=300&width=300",
    rating: 5,
    reviews: 64,
    description:
      "Freshly baked artisan sourdough bread made with organic flour.",
    inStock: true,
  },
  {
    id: 7,
    name: "Organic Spinach",
    category: "Vegetables",
    price: 3.49,
    oldPrice: 4.99,
    discount: 30,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 29,
    description: "Fresh organic spinach, washed and ready to eat.",
    inStock: true,
  },
  {
    id: 8,
    name: "Cold Brew Coffee",
    category: "Beverages",
    price: 4.49,
    oldPrice: 0,
    discount: 0,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4,
    reviews: 48,
    description:
      "Smooth and refreshing cold brew coffee made from premium beans.",
    inStock: true,
  },
];

// Mock user data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In a real app, this would be hashed
    avatar: null,
    createdAt: "2023-01-15T00:00:00.000Z",
  },
];

// Mock order data
const orders = [
  {
    id: "ORD-1001",
    userId: 1,
    date: "2023-05-15T10:30:00.000Z",
    status: "Delivered",
    items: 3,
    total: 28.97,
  },
  {
    id: "ORD-1002",
    userId: 1,
    date: "2023-06-20T14:45:00.000Z",
    status: "Shipped",
    items: 2,
    total: 35.98,
  },
  {
    id: "ORD-1003",
    userId: 1,
    date: "2023-07-05T09:15:00.000Z",
    status: "Processing",
    items: 4,
    total: 42.46,
  },
];

const handleImage = async (imageUrl) => {
  let img;

  if (imageUrl.startsWith("http")) {
    img = imageUrl;
  } else {
    // Ensure the path becomes clean: remove '../' or anything unwanted
    const cleanPath = imageUrl.replace(/^(\.\.\/)+/, "");
    img = `http://localhost:5000/${cleanPath}`;
  }

  console.log("Trying image URL:", img);

  try {
    await axios.get(img); // Check if image is reachable
    return img;
  } catch (error) {
    console.log("Error fetching image:", error.message);
    return "";
  }
};

// Update fetchProducts to use the fixed function
export const fetchProducts = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/products");
    const data = response.data;

    const products = await Promise.all(
      data.data.map(async (product) => {
        let image = await handleImage(product.image);
        return {
          ...product,
          image,
        };
      })
    );
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const product = products.find((p) => p.id === Number.parseInt(id));

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const loginUser = async (email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const signupUser = async (name, email, password) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (users.some((u) => u.email === email)) {
    throw new Error("Email already in use");
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password,
    avatar: null,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  // Don't return the password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const updateUserProfile = async (userId, data) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...data,
  };

  // Don't return the password
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

export const fetchOrders = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return orders;
};
