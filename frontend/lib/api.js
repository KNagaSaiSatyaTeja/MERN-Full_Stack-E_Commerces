"use client";

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const handleImage = (imageUrl) => {
  if (!imageUrl) return "/placeholder.svg?height=300&width=300";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  } else {
    // Clean the path and construct full URL
    const cleanPath = imageUrl.replace(/^(\.\.\/)+/, "");
    return `http://localhost:5000/${cleanPath}`;
  }
};

// Products API
export const fetchProducts = async () => {
  try {
    const response = await api.get("/products");
    const data = response.data;
    console.log("Fetched products:", data, "\n----\n", response);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch products");
    }

    const products = data.data.map((product) => ({
      ...product,
      id: product._id, // Map MongoDB _id to id for frontend compatibility
      image: handleImage(product.image),
      oldPrice: 0, // Add default values for frontend compatibility
      discount: 0,
      reviews: Math.floor(Math.random() * 100) + 10, // Mock reviews count
      inStock: true,
    }));

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Product not found");
    }

    const product = {
      ...data.data,
      id: data.data._id,
      image: handleImage(data.data.image),
      oldPrice: 0,
      discount: 0,
      reviews: Math.floor(Math.random() * 100) + 10,
      inStock: true,
    };

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error(error.response?.data?.message || "Product not found");
  }
};

export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    const response = await api.post("/products/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to create product");
    }

    return {
      ...data.data,
      id: data.data._id,
      image: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create product"
    );
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    const response = await api.put(`/products/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to update product");
    }

    return {
      ...data.data,
      id: data.data._id,
      image: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update product"
    );
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/delete/${id}`);
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to delete product");
    }

    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete product"
    );
  }
};

// Users API
export const signupUser = async (
  name,
  email,
  password,
  address = "Default Address"
) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);

    const response = await api.post("/users/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    if (!data.status) {
      throw new Error(data.message || "Failed to create account");
    }

    return {
      ...data.data,
      id: data.data._id,
      avatar: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create account"
    );
  }
};

export const loginUser = async (email, password) => {
  try {
    // Get user by email first
    const response = await api.get(`/users/byEmail?email=${email}`);
    const data = response.data;

    if (!data.status) {
      throw new Error("Invalid email or password");
    }

    // In a real app, you would verify password on backend
    // For now, we'll simulate login success
    return {
      ...data.data,
      id: data.data._id,
      avatar: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error logging in:", error);
    throw new Error("Invalid email or password");
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });

    const response = await api.patch(`/users/update/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;
    if (!data.status) {
      throw new Error(data.message || "Failed to update profile");
    }

    return {
      ...data.data,
      id: data.data._id,
      avatar: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update profile"
    );
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/byUserId/${userId}`);
    const data = response.data;

    if (!data.status) {
      throw new Error(data.message || "User not found");
    }

    return {
      ...data.data,
      id: data.data._id,
      avatar: handleImage(data.data.image),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(error.response?.data?.message || "User not found");
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/users/delete/${userId}`);
    const data = response.data;

    if (!data.status) {
      throw new Error(data.message || "Failed to delete user");
    }

    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    const data = response.data;

    if (!data.status) {
      throw new Error(data.message || "Failed to fetch users");
    }

    const users = data.allUsers.map((user) => ({
      ...user,
      id: user._id,
      avatar: handleImage(user.image),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

// Cart API
export const getCart = async (userId) => {
  try {
    const response = await api.get(`/cart/${userId}`);
    const data = response.data;

    if (!data.success) {
      // If cart doesn't exist, return empty cart
      if (response.status === 404 || data.message === "Cart not found") {
        return { products: [] };
      }
      throw new Error(data.message || "Failed to fetch cart");
    }

    // Transform cart data for frontend compatibility
    const cart = {
      ...data.data,
      products: data.data.products.map((item) => ({
        id: item.product_id._id,
        name: item.product_id.name,
        price: item.product_id.price,
        image: handleImage(item.product_id.image),
        quantity: item.quantity,
        category: item.product_id.category,
        description: item.product_id.description,
      })),
    };

    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (error.response?.status === 404) {
      return { products: [] };
    }
    throw new Error(error.response?.data?.message || "Failed to fetch cart");
  }
};

export const addToCart = async (userId, products) => {
  try {
    const response = await api.post("/cart/create", {
      userId,
      products: Array.isArray(products) ? products : [products],
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to add to cart");
    }

    return data.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error(error.response?.data?.message || "Failed to add to cart");
  }
};

export const removeFromCart = async (userId, productId) => {
  try {
    const response = await api.delete("/cart/removeFromCart", {
      data: { userId, productId },
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to remove from cart");
    }

    return data.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw new Error(
      error.response?.data?.message || "Failed to remove from cart"
    );
  }
};

export const clearCart = async (userId) => {
  try {
    const response = await api.delete(`/cart/${userId}`);
    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || "Failed to clear cart");
    }

    return data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw new Error(error.response?.data?.message || "Failed to clear cart");
  }
};

export const deleteSelectedProducts = async (userId, productIds) => {
  try {
    const response = await api.delete("/cart/deleteSelectedPorducte", {
      data: { userId, productIds },
    });

    const data = response.data;
    if (!data.success) {
      throw new Error(data.message || "Failed to delete selected products");
    }

    return data.data;
  } catch (error) {
    console.error("Error deleting selected products:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete selected products"
    );
  }
};

// Mock orders for now (you can implement orders API later)
export const fetchOrders = async () => {
  // Mock order data since orders API is not implemented yet
  const orders = [
    {
      id: "ORD-1001",
      date: "2023-05-15T10:30:00.000Z",
      status: "Delivered",
      items: 3,
      total: 28.97,
    },
    {
      id: "ORD-1002",
      date: "2023-06-20T14:45:00.000Z",
      status: "Shipped",
      items: 2,
      total: 35.98,
    },
    {
      id: "ORD-1003",
      date: "2023-07-05T09:15:00.000Z",
      status: "Processing",
      items: 4,
      total: 42.46,
    },
  ];

  await new Promise((resolve) => setTimeout(resolve, 800));
  return orders;
};
