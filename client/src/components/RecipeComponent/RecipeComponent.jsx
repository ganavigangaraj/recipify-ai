import './RecipeComponent.css'


function RecipeComponent(props) {
    const recipe = props.recipe
   return (
        <div className="recipe-section">
            <h2 className="recipe-title">{recipe.title}</h2>
            <p className="recipe-description">Cuisine: {recipe.cuisine} | Style: {recipe.style} | Prep Time: {recipe.prepTime}</p>
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

export default RecipeComponent;
