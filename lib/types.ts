export interface Macros {
  calories: string;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Day {
  day: string;
  mealName: string;
  protein: string;
  carb: string;
  vegetables: string;
  fruit: string;
  macros: Macros;
  ingredients: string[];
  cookingInstructions: string[];
  tonightPrep: string[] | null;
}

export interface SundayPrep {
  chopAndStore: string[];
  cookTonight: string[];
}

export interface GroceryList {
  proteins: string[];
  carbsAndGrains: string[];
  vegetables: string[];
  freshProduce: string[];
  fruits: string[];
  pantryAndCondiments: string[];
}

export interface MealPlan {
  days: Day[];
  sundayPrep: SundayPrep;
  groceryList: GroceryList;
}

export interface FormInput {
  planLength: 3 | 5 | 6;
  proteins: string[];
  carbs: string[];
  servings: number;
  restrictions: string[];
  adventurousness: "simple" | "moderate" | "bold";
}
