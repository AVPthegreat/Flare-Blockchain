"use client";

import { useState } from "react";
import { useMealStore } from "@/store/mealStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Plus, PackageOpen } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PantryPage() {
    const { pantry, addToPantry, removeFromPantry } = useMealStore();
    const [newItem, setNewItem] = useState("");

    const handleAdd = () => {
        if (newItem.trim()) {
            addToPantry(newItem.trim());
            setNewItem("");
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex justify-center">
            <div className="w-full max-w-3xl">
                <header className="flex justify-between items-center mb-8">
                    <Link href="/planner">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Planner
                        </Button>
                    </Link>
                </header>

                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            <PackageOpen className="h-8 w-8 text-primary" />
                            Smart Pantry
                        </CardTitle>
                        <p className="text-muted-foreground">
                            Add ingredients you already have. We&apos;ll prioritize them in your meal plans.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add an ingredient (e.g., Rice, Olive Oil)..."
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                            />
                            <Button onClick={handleAdd}>
                                <Plus className="h-4 w-4" />
                                Add
                            </Button>
                        </div>

                        {pantry.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-xl border border-dashed">
                                <p>Your pantry is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {pantry.map((item, index) => (
                                    <motion.div
                                        key={`${item}-${index}`}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border"
                                    >
                                        <span className="font-medium">{item}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromPantry(item)}
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
