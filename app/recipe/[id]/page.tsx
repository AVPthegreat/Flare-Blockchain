"use client";

import { useMealStore } from "@/store/mealStore";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChefHat, Clock, Flame, PlayCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function RecipePage() {
    const params = useParams();
    const router = useRouter();
    const { weeklyPlan } = useMealStore();
    const [cookingMode, setCookingMode] = useState(false);

    // Helper to find meal by ID (simplified for demo)
    // In a real app, we'd fetch from DB or store map
    let foundMeal = null;
    Object.values(weeklyPlan).forEach(day => {
        if (day.breakfast?.id === params.id) foundMeal = day.breakfast;
        if (day.lunch?.id === params.id) foundMeal = day.lunch;
        if (day.dinner?.id === params.id) foundMeal = day.dinner;
    });

    if (!foundMeal) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Recipe not found</h1>
                    <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
                </div>
            </div>
        );
    }

    const meal = foundMeal as unknown as import("@/store/mealStore").Meal;

    return (
        <div className={`min-h-screen bg-background p-6 ${cookingMode ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : ''}`}>
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => cookingMode ? setCookingMode(false) : router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {cookingMode ? "Exit Cooking Mode" : "Back"}
                    </Button>
                    <Button
                        variant={cookingMode ? "secondary" : "default"}
                        onClick={() => setCookingMode(!cookingMode)}
                    >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        {cookingMode ? "Stop Cooking" : "Start Cooking Mode"}
                    </Button>
                </header>

                <motion.div layout>
                    <Card className="border-none shadow-none bg-transparent">
                        <CardHeader>
                            <CardTitle className={`${cookingMode ? 'text-5xl' : 'text-4xl'} font-bold mb-4`}>
                                {meal.name}
                            </CardTitle>
                            <div className="flex gap-6 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                    <span>{meal.calories} kcal</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                    <span>30 mins</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ChefHat className="h-5 w-5 text-primary" />
                                    <span>Easy</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-12 mt-8">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold">Ingredients</h3>
                                <ul className="space-y-3">
                                    {meal.ingredients.map((ing, i) => (
                                        <li key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className={cookingMode ? "text-xl" : ""}>{ing}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-semibold">Instructions</h3>
                                <div className="space-y-6">
                                    {meal.instructions?.map((step, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                                {i + 1}
                                            </div>
                                            <p className={`${cookingMode ? "text-2xl leading-relaxed" : "text-lg text-muted-foreground"}`}>
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
