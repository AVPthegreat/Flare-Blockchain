import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
  image?: string;
}

export interface WeeklyPlan {
  [key: string]: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
  };
}

interface MealStore {
  preferences: {
    diet: string;
    allergies: string[];
    calories: number;
  };
  weeklyPlan: WeeklyPlan;
  shoppingList: string[];
  pantry: string[];
  
  setPreferences: (prefs: Partial<MealStore['preferences']>) => void;
  setMeal: (day: DayOfWeek, type: MealType, meal: Meal) => void;
  generatePlan: () => Promise<void>;
  addToShoppingList: (item: string) => void;
  removeFromShoppingList: (item: string) => void;
  clearShoppingList: () => void;
  addToPantry: (item: string) => void;
  removeFromPantry: (item: string) => void;
}

const MOCK_MEALS: Meal[] = [
  { id: '1', name: 'Avocado Toast & Eggs', calories: 450, ingredients: ['Bread', 'Avocado', 'Eggs', 'Chili Flakes'], instructions: ['Toast bread', 'Mash avocado', 'Fry egg', 'Assemble'] },
  { id: '2', name: 'Grilled Chicken Salad', calories: 550, ingredients: ['Chicken Breast', 'Lettuce', 'Tomatoes', 'Cucumber', 'Olive Oil'], instructions: ['Grill chicken', 'Chop veggies', 'Mix dressing', 'Toss salad'] },
  { id: '3', name: 'Salmon with Asparagus', calories: 600, ingredients: ['Salmon Fillet', 'Asparagus', 'Lemon', 'Garlic'], instructions: ['Season salmon', 'Roast asparagus', 'Bake salmon', 'Serve with lemon'] },
  { id: '4', name: 'Oatmeal with Berries', calories: 350, ingredients: ['Oats', 'Milk', 'Blueberries', 'Honey'], instructions: ['Boil milk', 'Add oats', 'Simmer', 'Top with berries'] },
  { id: '5', name: 'Pasta Primavera', calories: 700, ingredients: ['Pasta', 'Bell Peppers', 'Zucchini', 'Parmesan'], instructions: ['Boil pasta', 'Sauté veggies', 'Mix together', 'Top with cheese'] },
];

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      preferences: {
        diet: 'Omnivore',
        allergies: [],
        calories: 2000,
      },
      weeklyPlan: {
        Monday: { breakfast: null, lunch: null, dinner: null },
        Tuesday: { breakfast: null, lunch: null, dinner: null },
        Wednesday: { breakfast: null, lunch: null, dinner: null },
        Thursday: { breakfast: null, lunch: null, dinner: null },
        Friday: { breakfast: null, lunch: null, dinner: null },
        Saturday: { breakfast: null, lunch: null, dinner: null },
        Sunday: { breakfast: null, lunch: null, dinner: null },
      },
      shoppingList: [],
      pantry: [],

      setPreferences: (prefs) =>
        set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

      setMeal: (day, type, meal) =>
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: { ...state.weeklyPlan[day], [type]: meal },
          },
        })),

      generatePlan: async () => {
        const { preferences, pantry } = get();
        
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...preferences, pantry }),
          });
          
          if (!response.ok) throw new Error('Failed to generate');
          
          const newPlan = await response.json();
          
          set((state) => {
             const allIngredients = new Set<string>();
             const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
             
             days.forEach(day => {
                 if (newPlan[day]) {
                     ['breakfast', 'lunch', 'dinner'].forEach(type => {
                         const meal = newPlan[day][type as MealType];
                         if (meal) {
                             meal.ingredients.forEach((ing: string) => {
                                 if (!state.pantry.includes(ing)) {
                                     allIngredients.add(ing);
                                 }
                             });
                         }
                     });
                 }
             });

             return { weeklyPlan: newPlan, shoppingList: Array.from(allIngredients) };
          });
          
        } catch (error) {
          console.error("Generation failed, falling back to mock", error);
          // Fallback logic could go here, or just alert the user
        }
      },

      addToShoppingList: (item) =>
        set((state) => ({ shoppingList: [...state.shoppingList, item] })),

      removeFromShoppingList: (item) =>
        set((state) => ({
          shoppingList: state.shoppingList.filter((i) => i !== item),
        })),

      clearShoppingList: () => set({ shoppingList: [] }),

      addToPantry: (item) =>
        set((state) => ({ pantry: [...state.pantry, item] })),

      removeFromPantry: (item) =>
        set((state) => ({
          pantry: state.pantry.filter((i) => i !== item),
        })),
    }),
    {
      name: 'meal-planner-storage',
    }
  )
);
