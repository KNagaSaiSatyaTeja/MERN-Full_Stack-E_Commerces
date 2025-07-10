"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { fetchProducts } from "@/lib/api";

export function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log(data);

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    addToCart(product).then(() => {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }).catch((error) => {
      toast({
        title: "Failed to add to cart",
        description: error.message,
        variant: "destructive",
      });
    });
  };

  const handleAddToCartOld = (product) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    /* addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    }); */
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-square animate-pulse bg-muted"></div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <div className="h-10 w-full animate-pulse rounded bg-muted"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <Card key={product._id} className="overflow-hidden">
          <div className="relative">
            <Link href={`/products/${product._id}`}>
              <div className="aspect-square overflow-hidden">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </Link>
            {product.discount > 0 && (
              <Badge className="absolute left-2 top-2 bg-red-500 text-white hover:bg-red-600">
                {product.discount}% OFF
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 rounded-full bg-background/80 backdrop-blur-sm"
            >
              <Heart className="h-5 w-5" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
          <CardContent className="p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < product.rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({product.reviews})
                </span>
              </div>
              <Link href={`/products/${product.id}`}>
                <h3 className="font-semibold hover:underline">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-muted-foreground">
                {product.category}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  ${product.price.toFixed(2)}
                </span>
                {product?.oldPrice > 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full" onClick={() => handleAddToCart(product)}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
