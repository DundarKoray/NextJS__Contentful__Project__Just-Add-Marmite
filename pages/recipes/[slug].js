import { createClient } from "contentful";

//contentful credentials from .env.local file
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY
});

// creating dynamic pages amount of repice items
export const getStaticPaths = async () => {
  //getting recipe model type from contentful
  const res = await client.getEntries({ content_type: 'recipe' })
  
  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    // because the names are the same we can just write path
    // paths: paths,
    paths,
    fallback: false
  }
}

//fetching data from Contentful
export async function getStaticProps({ params }) {
  
  const { items } = await client.getEntries({ 
    content_type: 'recipe',
    // we dont want to fetch every recipe item but just one
    'fields.slug': params.slug 
  })

  return {
    props: { recipe: items[0] }
  }

}

export default function RecipeDetails({ recipe }) {
  console.log(recipe);
  return (
    <div>
      <h1>{recipe.fields.title}</h1>
    </div>
  )
}