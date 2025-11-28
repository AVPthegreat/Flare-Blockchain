"use client";

import { useMealStore } from "@/store/mealStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ShoppingListPage() {
    const { shoppingList, removeFromShoppingList, clearShoppingList } = useMealStore();

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
                    <Button variant="destructive" onClick={clearShoppingList} disabled={shoppingList.length === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear All
                    </Button>
                </header>

                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Shopping List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {shoppingList.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg">Your list is empty.</p>
                                <p>Generate a meal plan to get started!</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {shoppingList.map((item, index) => (
                                    <motion.li
                                        key={`${item}-${index}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-primary" />
                                            <span className="text-lg">{item}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFromShoppingList(item)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
