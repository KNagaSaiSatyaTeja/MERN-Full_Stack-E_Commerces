"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import dotenv from "dotenv";
dotenv.config();
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}
const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        const data = response.data?.data || response.data;
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        console.error("Error fetching products:", error);
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Failed to load products"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getImageUrl = (imagePath: string) => {
    // Replace with your default image path

    return `${process.env.NEXT_PUBLIC_API_URL}${imagePath}`;
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Our Products</h1>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative aspect-square">
                        {product?.image ? (
                          <Image
                            src={getImageUrl(product.image.src)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder.jpg"; // Fallback to placeholder image
                            }}
                            alt={product.name}
                            fill
                            priority
                            className="object-cover absolute inset-0"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-100">
                            Image not found
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg truncate">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mt-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-primary font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Products;
