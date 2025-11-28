"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Sparkles, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg">
            <ChefHat className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            NourishAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton showBalance={false} />
          <ModeToggle />
          <Link href="/onboarding">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-50" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Eat Smarter. <br />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Live Better.
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of meal planning. AI-curated weekly plans, instant shopping lists, and personalized nutrition—all in one premium app.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/onboarding">
              <Button size="lg" className="text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Start Planning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full">
              View Demo
            </Button>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-4"
        >
          {[
            {
              icon: Sparkles,
              title: "AI Generation",
              desc: "Personalized meal plans generated in seconds based on your diet and goals."
            },
            {
              icon: ChefHat,
              title: "Chef Curated",
              desc: "Access thousands of premium recipes with detailed nutritional info."
            },
            {
              icon: ShoppingBag,
              title: "Smart Shopping",
              desc: "Auto-generated shopping lists sorted by aisle for efficient grocery runs."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-card border hover:border-primary/50 transition-colors text-left">
              <feature.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="py-8 text-center text-muted-foreground text-sm">
        © 2024 NourishAI. All rights reserved.
      </footer>
    </div>
  );
}
