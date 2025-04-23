import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Apple, Beef, Carrot, Coffee, Fish, Pizza } from "lucide-react"

export function Categories() {
  const categories = [
    { name: "Fruits", icon: Apple, href: "/products?category=fruits" },
    { name: "Vegetables", icon: Carrot, href: "/products?category=vegetables" },
    { name: "Meat", icon: Beef, href: "/products?category=meat" },
    { name: "Seafood", icon: Fish, href: "/products?category=seafood" },
    { name: "Bakery", icon: Pizza, href: "/products?category=bakery" },
    { name: "Beverages", icon: Coffee, href: "/products?category=beverages" },
  ]

  return (
    <div className="py-8">
      <h2 className="mb-6 text-2xl font-bold">Categories</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="transition-all hover:border-primary hover:shadow-md">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <category.icon className="mb-3 h-8 w-8 text-primary" />
                <span className="text-center font-medium">{category.name}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
