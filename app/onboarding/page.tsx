"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMealStore } from "@/store/mealStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

const DIET_OPTIONS = ["Omnivore", "Vegetarian", "Vegan", "Keto", "Paleo"];
const ALLERGY_OPTIONS = ["Nuts", "Dairy", "Gluten", "Shellfish", "Soy"];

export default function OnboardingPage() {
    const router = useRouter();
    const { setPreferences, generatePlan } = useMealStore();
    const [step, setStep] = useState(1);
    const [diet, setDiet] = useState("Omnivore");
    const [calories, setCalories] = useState(2000);
    const [allergies, setAllergies] = useState<string[]>([]);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            setPreferences({ diet, calories, allergies });
            generatePlan();
            router.push("/planner");
        }
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies((prev) =>
            prev.includes(allergy)
                ? prev.filter((a) => a !== allergy)
                : [...prev, allergy]
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Let&apos;s Personalize
                        </CardTitle>
                        <CardDescription className="text-center text-lg">
                            Step {step} of 3
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xl font-semibold">Choose your diet</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {DIET_OPTIONS.map((option) => (
                                        <Button
                                            key={option}
                                            variant={diet === option ? "default" : "outline"}
                                            className="w-full justify-start text-lg h-12"
                                            onClick={() => setDiet(option)}
                                        >
                                            {diet === option && <Check className="mr-2 h-5 w-5" />}
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xl font-semibold">Daily Calorie Goal</h3>
                                <div className="flex flex-col items-center space-y-4">
                                    <span className="text-6xl font-bold text-primary">
                                        {calories}
                                    </span>
                                    <input
                                        type="range"
                                        min="1200"
                                        max="4000"
                                        step="50"
                                        value={calories}
                                        onChange={(e) => setCalories(Number(e.target.value))}
                                        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-muted-foreground">kcal / day</p>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="text-xl font-semibold">Any Allergies?</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {ALLERGY_OPTIONS.map((option) => (
                                        <Button
                                            key={option}
                                            variant={allergies.includes(option) ? "destructive" : "outline"}
                                            className="w-full justify-start"
                                            onClick={() => toggleAllergy(option)}
                                        >
                                            {allergies.includes(option) && <Check className="mr-2 h-4 w-4" />}
                                            {option}
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleNext} className="w-full text-lg h-12">
                            {step === 3 ? "Generate My Plan" : "Next Step"}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
