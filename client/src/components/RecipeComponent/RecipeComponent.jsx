import './RecipeComponent.css'


function RecipeComponent(props) {
    const recipe = props.recipe
   return (
        <div className="recipe-section">
            <h2 className="recipe-title">{recipe.title}</h2>
            <p className="recipe-description">Cuisine: {recipe.cuisine} | Style: {recipe.style} | Prep Time: {recipe.prep_time}</p>
            <h3 className="recipe-ingredients">Ingredients:</h3>
            <ul className="recipe-ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h3 className="recipe-instructions">Instructions:</h3>
            <ol className="list-decimal list-inside">
                {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>

  )
}

export default RecipeComponent

    // <div>
    //  {recipe && recipe.map(recipeItem => (
    //     <div key={recipeItem.id} className="mb-8">
    //       <h2 className="text-2xl font-bold mb-2">{recipeItem.title}</h2>
    //         <p className="text-sm text-gray-600 mb-4">{recipeItem.cuisine} | {recipeItem.style} | Prep Time: {recipeItem.prepTime}</p>

    //         <h3 className="text-xl font-semibold mb-2">Ingredients:</h3>
    //         <ul className="list-disc list-inside mb-4">
    //           {recipeItem.ingredients.map((ing, index) => (

    //             <li key={index}>{ing}</li>
    //           ))}
    //         </ul>   
    //         <h3 className="text-xl font-semibold mb-2">Instructions:</h3>
    //         <ol className="list-decimal list-inside">
    //           {recipeItem.instructions.map((inst, index) => (
    //             <li key={index}>{inst}</li> 
    //             ))}
    //         </ol>
    //     </div>
    //     ))}

    // </div>