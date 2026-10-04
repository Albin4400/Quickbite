export type FoodSource = 'api' | 'admin';

export interface Food {
  key: string;
  source: FoodSource;
  sourceId: string;
  name: string;
  category: string;
  area: string;
  description: string;
  imageUrl: string;
  price: number;
  ingredients: string[];
  instructions: string;
}

export interface MealDbMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  [key: string]: string | null | undefined;
}

export interface MealDbResponse {
  meals: MealDbMeal[] | null;
}

export interface LocalFoodRecord {
  id: number;
  food_key: string;
  name: string;
  price: number;
  category: string;
  area: string | null;
  description: string | null;
  image_url: string | null;
  ingredients: string[] | null;
  instructions: string | null;
  source: 'admin';
}

export interface AdminFoodPayload {
  name: string;
  price: number;
  category: string;
  area: string;
  description: string;
  image_url: string;
  ingredients: string[];
  instructions: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string | null;
}

export function fromMealDb(meal: MealDbMeal): Food {
  const ingredients = Array.from({ length: 20 }, (_, index) => meal[`strIngredient${index + 1}`]?.trim())
    .filter((ingredient): ingredient is string => Boolean(ingredient));

  return {
    key: `api-${meal.idMeal}`,
    source: 'api',
    sourceId: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory ?? '',
    area: meal.strArea ?? '',
    description: 'A recipe from TheMealDB.',
    imageUrl: meal.strMealThumb,
    price: 299,
    ingredients,
    instructions: meal.strInstructions ?? ''
  };
}

export function fromLocalFood(food: LocalFoodRecord): Food {
  return {
    key: food.food_key,
    source: 'admin',
    sourceId: String(food.id),
    name: food.name,
    category: food.category,
    area: food.area ?? '',
    description: food.description ?? '',
    imageUrl: food.image_url ?? '',
    price: food.price,
    ingredients: food.ingredients ?? [],
    instructions: food.instructions ?? ''
  };
}
