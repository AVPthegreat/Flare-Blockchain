"use client";

import { useMealStore, DayOfWeek, MealType } from "@/store/mealStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart, Calendar, PackageOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PlannerPage() {
    const { weeklyPlan, generatePlan } = useMealStore();
    const days = Object.keys(weeklyPlan) as DayOfWeek[];

    return (
        <div className="min-h-screen bg-background p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Your Weekly Plan
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        AI-curated meals just for you
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => generatePlan()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Regenerate
                    </Button>
                    <Link href="/pantry">
                        <Button variant="secondary">
                            <PackageOpen className="mr-2 h-4 w-4" />
                            My Pantry
                        </Button>
                    </Link>
                    <Link href="/shopping-list">
                        <Button>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Shopping List
                        </Button>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {days.map((day, index) => (
                    <motion.div
                        key={day}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center text-xl">
                                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                                    {day}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((type) => {
                                    const meal = weeklyPlan[day][type];
                                    return (
                                        <div key={type} className="group cursor-pointer">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                                {type}
                                            </p>
                                            <div className="p-3 rounded-lg bg-secondary/50 group-hover:bg-secondary transition-colors">
                                                {meal ? (
                                                    <Link href={`/recipe/${meal.id}`}>
                                                        <p className="font-medium text-foreground hover:underline">
                                                            {meal.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {meal.calories} kcal
                                                        </p>
                                                    </Link>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">
                                                        No meal planned
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
