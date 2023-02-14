import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";
import Skeleton from "../components/Skeleton";

//fetching data from Contentful
export async function getStaticProps() {

  //contentful credentials from .env.local file
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY
  }); 

  //getting recipe model type from contentful
  const res = await client.getEntries({ content_type: 'recipe' })

  //exporting the data that is fetched as props
  return {
    props: {
      recipes: res.items,
      revalidate: 1
    }
  }

}

export default function Recipes({ recipes }) {
  console.log(recipes);
  if(!recipes) return <Skeleton />

  return (
    <div className="recipe-list">
      {recipes.map(recipe => (
        <RecipeCard key={recipe.sys.id} recipe={recipe} />
      ))}

      <style jsx>{`
        .recipe-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-gap: 20px 60px;
        }
      `}</style>
    </div>
  )
}