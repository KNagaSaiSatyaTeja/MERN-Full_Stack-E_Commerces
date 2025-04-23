import { ProductGrid } from "@/components/product-grid"
import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <Categories />
      <h2 className="mb-6 mt-12 text-3xl font-bold">Featured Products</h2>
      <ProductGrid />
    </div>
  )
}
