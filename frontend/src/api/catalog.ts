import axios from "axios";

const catalogEndpoint = import.meta.env.VITE_CATALOG_MIDDLEWARE;

interface Recipe {
  id: number;
  title: string;
  image_links: string[];
  description: string;
  author_uid: string;
  created_at: string;
  updated_at: string;
  author_details: Details;
}
interface Details {
  uid: string;
  username: string;
  created_at: string;
}
const getAllRecipes = async (): Promise<Recipe[]> => {
  const result = await axios.get(`${catalogEndpoint}/recipes`);
  return result.data;
};


interface CreateRecipe {
  title: string;
  image_links: string[];
  description: string;
  author_uid: string;
}
const createRecipe = async (token: string, recipe: CreateRecipe): Promise<CreateRecipe | null> => {
  try {
    const response = await axios.post<CreateRecipe>(`${catalogEndpoint}/recipes`, recipe, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    return null;
  }
};

export {
  createRecipe,
  getAllRecipes,
}

export type {
  Recipe,
  CreateRecipe,
}
