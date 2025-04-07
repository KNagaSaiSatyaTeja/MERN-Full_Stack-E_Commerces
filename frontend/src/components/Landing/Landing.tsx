"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, Clock } from "lucide-react";

interface LandingProps {
  isLoggedIn: boolean;
  userName: string;
}

const Landing = ({ isLoggedIn, userName }: LandingProps) => {
  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Delivery",
      description: "Free delivery on all orders above $50",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Secure Payment",
      description: "100% secure payment methods",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Dedicated support team",
    },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen">
        <section className="relative h-[90vh] flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl font-bold">
                  Welcome to Our Restaurant
                </h1>
                <p className="text-lg text-muted-foreground">
                  Please login or register to continue exploring our delicious
                  meals.
                </p>
                <div className="flex gap-4">
                  <Button asChild size="lg">
                    <Link href="/login">
                      Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative h-[400px] rounded-lg overflow-hidden"
              >
                <Image
                  src="/assets/hero-food.jpg"
                  alt="Delicious Food"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome back, {userName}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Continue exploring our delicious meals and exclusive offers.
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg">
                  <Link href="/menu">
                    Order Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/favorites">View Favorites</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative h-[400px] rounded-lg overflow-hidden"
            >
              <Image
                src="/assets/hero-food.jpg"
                alt="Delicious Food"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-lg bg-background shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
