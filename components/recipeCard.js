import Link from 'next/link';
import Image from 'next/image';
export default function recipeCard({ recipe }) {
    const {title, cookingTime, featuredImage, ingredient, method, slug, thumbnail} = recipe.fields;
    return (
        <div className="card">
            <div className="featured">
                {/* image thumb */}
                <Image
                    src={'https:' + thumbnail.fields.file.url} 
                    width={thumbnail.fields.file.details.image.width}
                    height={thumbnail.fields.file.details.image.height}
                />
            </div>
            <div className="content">
                <div className="info">
                    <h4>{ title }</h4>
                    <p>Takes approx { cookingTime } mins to make</p>
                </div>
                <div className="actions">
                    <Link href={`/recipes/${slug}`} legacyBehavior>Cook this! </Link>
                </div>
            </div>
        </div>
    )
}
