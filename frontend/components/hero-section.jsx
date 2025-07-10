import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Fresh Food <br />
              <span className="text-primary">Delivered</span> to <br />
              Your Door
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted-foreground">
              Discover a wide range of fresh, organic, and delicious food products. Order now and enjoy free delivery on
              your first order.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button variant="outline" size="lg">
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-background/50 to-transparent" />
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="Fresh food selection"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
