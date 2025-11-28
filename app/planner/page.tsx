"use client";

import { useMealStore, DayOfWeek, MealType } from "@/store/mealStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart, Calendar, PackageOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MacroChart } from "@/components/macro-chart";
import { useAccount, useWriteContract } from 'wagmi';
import { MEAL_PLAN_REGISTRY_ABI, MEAL_PLAN_REGISTRY_ADDRESS } from '@/lib/abi';

export default function PlannerPage() {
    const { weeklyPlan, generatePlan } = useMealStore();
    const days = Object.keys(weeklyPlan) as DayOfWeek[];
    const { isConnected } = useAccount();
    const { writeContract, isPending } = useWriteContract();

    const handlePublish = () => {
        const planString = JSON.stringify(weeklyPlan);
        // In a real app, you'd hash this or upload to IPFS
        writeContract({
            address: MEAL_PLAN_REGISTRY_ADDRESS,
            abi: MEAL_PLAN_REGISTRY_ABI,
            functionName: 'publishPlan',
            args: [planString],
        });
    };

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
                    {isConnected && (
                        <Button variant="outline" onClick={handlePublish} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PackageOpen className="mr-2 h-4 w-4" />}
                            {isPending ? 'Publishing...' : 'Save to Flare'}
                        </Button>
                    )}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {days.map((day) => (
                        <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-primary" />
                                        {day}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["breakfast", "lunch", "dinner"].map((type) => {
                                            const meal = weeklyPlan[day]?.[type as MealType];
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
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">Daily Nutrition</CardTitle>
                            <CardDescription>Average daily intake based on your plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Calculate average macros */}
                            {(() => {
                                let totalProtein = 0, totalCarbs = 0, totalFat = 0, daysCount = 0;
                                Object.values(weeklyPlan).forEach(day => {
                                    if (day.breakfast || day.lunch || day.dinner) {
                                        daysCount++;
                                        [day.breakfast, day.lunch, day.dinner].forEach(meal => {
                                            if (meal) {
                                                totalProtein += meal.protein || 0;
                                                totalCarbs += meal.carbs || 0;
                                                totalFat += meal.fat || 0;
                                            }
                                        });
                                    }
                                });
                                const avgProtein = daysCount ? Math.round(totalProtein / daysCount) : 0;
                                const avgCarbs = daysCount ? Math.round(totalCarbs / daysCount) : 0;
                                const avgFat = daysCount ? Math.round(totalFat / daysCount) : 0;

                                return (
                                    <div className="space-y-6">
                                        <MacroChart protein={avgProtein} carbs={avgCarbs} fat={avgFat} />
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2 rounded-lg bg-blue-500/10">
                                                <p className="text-xs text-muted-foreground">Protein</p>
                                                <p className="font-bold text-blue-500">{avgProtein}g</p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-green-500/10">
                                                <p className="text-xs text-muted-foreground">Carbs</p>
                                                <p className="font-bold text-green-500">{avgCarbs}g</p>
                                            </div>
                                            <div className="p-2 rounded-lg bg-orange-500/10">
                                                <p className="text-xs text-muted-foreground">Fat</p>
                                                <p className="font-bold text-orange-500">{avgFat}g</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
