import Header from "./components/Header";
import { useQuery } from "@tanstack/react-query";
import { Recipe, getAllRecipes } from "./api/catalog";

const getDateString = (dateStr: string): string => {
  const parsedDate = new Date(dateStr);

  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  const dateFormatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = dateFormatter.format(parsedDate);

  const [monthDay, time] = formattedDate.split(' at ');
  const [month, day] = monthDay.split(' ');

  const dayInt = parseInt(day, 10);
  const daySuffix = (dayInt % 10 === 1 && dayInt !== 11) ? 'st' :
                    (dayInt % 10 === 2 && dayInt !== 12) ? 'nd' :
                    (dayInt % 10 === 3 && dayInt !== 13) ? 'rd' : 'th';

  return `${month} ${day}${daySuffix} at ${time}`;
}

interface RecipeBoxProps {
  recipe: Recipe,
}
const RecipeBox = ({ recipe }: RecipeBoxProps) => {
  return (
    <div className="w-[800px] rounded bg-gray-100 border shadow my-2">
      <div className="h-[80px] bg-orange-500 flex flex-col justify-center p-4 rounded-tl rounded-tr">
        <p className="text-white font-bold text-2xl">{recipe.title}</p>
        <p className="text-white text-lg">{recipe.author_details.username} on {getDateString(recipe.created_at)}</p>
      </div>
      <div className="p-2">
        <p className="text-lg">{recipe.description}</p>
      </div>
      <div className="p-1 mt-2 flex bg-white border-t rounded-bl rounded-br overflow-x-scroll">
        {recipe.image_links.map((image) => <img className='w-[250px] m-1 rounded' key={image} src={`${import.meta.env.VITE_IMAGES_MIDDLEWARE}/image?id=${image}`} />)}
      </div>
    </div>
  );
};

const Recipes = () => {
  const { data: recipeList } = useQuery({
    queryFn: () => getAllRecipes(),
    queryKey: ["getAllRecipes"],
    enabled: true,
  });

  return (
    <Header pageName="Community Recipes">
      <div className="flex flex-col items-center mt-8">
        {recipeList?.map((recipe) => <RecipeBox key={recipe.id} recipe={recipe} />)}
      </div>
    </Header>
  )
};

export default Recipes;
