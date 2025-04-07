"use client";

import Products from "@/components/Products/Products";
import { useAuth } from "@/hooks/useAuth";

import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <Products />
    </main>
  );
}
