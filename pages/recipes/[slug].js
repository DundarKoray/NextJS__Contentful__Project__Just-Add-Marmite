import { createClient } from "contentful";
import Image from "next/image";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Skeleton from "../../components/Skeleton";
import { redirect } from "next/dist/server/api-utils";

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
    // is fallback is false page 404 will be active
    fallback: true
  }
}

//fetching data from Contentful
export async function getStaticProps({ params }) {
  
  const { items } = await client.getEntries({ 
    content_type: 'recipe',
    // we dont want to fetch every recipe item but just one
    'fields.slug': params.slug 
  })

  if (!items.length) {
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
    }
  }

  return {
    props: { recipe: items[0] },
    revalidate: 1
  }

}

export default function RecipeDetails({ recipe }) {
  console.log(recipe);

  if(!recipe) return <Skeleton />

  const { featuredImage, title, cookingTime, ingredient, method } = recipe.fields

  return (
    <div>
      <div className="banner">
        <Image 
          src={'https:' + featuredImage.fields.file.url}
          width={featuredImage.fields.file.details.image.width}
          height={featuredImage.fields.file.details.image.height}
        />
        <h2>{ title }</h2>
      </div>

      <div className="info">
        <p>It takes about {cookingTime} mins.</p>
        <h3>Ingredients:</h3>
        {ingredient.map((item, index)=>{
          return <span key={index}>{ item }</span> ;
        })}
      </div>

      <div className="method">
        <h3>Method:</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>

      <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .banner img {
          width: 100%;
          height: auto;
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
    </div>
  )
}