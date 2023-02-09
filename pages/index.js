import { createClient } from "contentful";
import RecipeCard from "../components/recipeCard";

//fetching data from Contentful
export async function getStaticProps() {

  //contentful credentials from .env.local file
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  }); 

  //getting recipe model type from contentful
  const res = await client.getEntries({ content_type: 'recipe' })

  //exporting the data as props
  return {
    props: {
      recipes: res.items
    }
  }

}

export default function Recipes({ recipes }) {
  // console.log(recipes);

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}
    </div>
  )
}