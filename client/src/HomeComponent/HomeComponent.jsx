import {  useState,useRef } from "react"
import IngredientComponent from '../components/IngredientComponent/IngredientComponent'
import RecipeComponent from '../components/RecipeComponent/RecipeComponent'
import './HomeComponent.css'
import { fetchRecipes } from "../services/recipeService"

export default function HomeComponent() {
    const buttonText = "Add Ingredient"
    const [ingredients, setIngredients] = useState([]);
    const [recipe, setRecipe] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
   
    const recipeSection = useRef(null)
    
    function addIngredients(formData){
        // formData.preventDefault()
        const newIngredient = formData.get('ingredient')
      setIngredients(prevIngredients => [...prevIngredients, newIngredient])
     }

    async function getRecipe() {
        if (isLoading) return // prevent multiple clicks while loading
        setIsLoading(true)
        setError(null) // clear previous error
        try {
            const recipeResponse = await fetchRecipes(ingredients)
            // console.log("RECIPE RESPONSE", recipeResponse)
            setRecipe(recipeResponse)
             // Scroll to the recipe section after setting the recipe
             if (recipeSection.current) {
                recipeSection.current.scrollIntoView({ behavior: 'smooth' });
              } 
            } catch (error) {
              console.error("Recipe fetch failed:", error.message);
              setError(error.message)
            } finally {
                    setIsLoading(false)
            }
    }

    return (
      <>
        <main className='p-4 font-mono bg-black min-h-screen'>
          <form
            className='flex flex-wrap justify-center gap-4'
            action={addIngredients}
          >
            <input
              type='text'
              name='ingredient'
              placeholder=' e.g oergano'
              aria-label='Add Ingredient'
              className='border-2 p-2 rounded-md shadow-lg shadow-gray-200 outline-gray-200 w-80 h-10 text-center font-normal leading-4 '
            />
            <button className="bg-orange-500 text-white rounded-md text-xl  font-medium pl-2 pr-2 text-center before:content-['+'] before:mr-4 ">
              {buttonText}
            </button>
          </form>
          {/* rendering only if there are any ingredients present in the ingredient list */}
          {ingredients.length > 0 && (
            <IngredientComponent
              ref={recipeSection}
              ingredients={ingredients}
              getRecipe={getRecipe}
              loading={isLoading}
              error={error}          
//              recipes={recipes} 
            />
          )}
          {/* rendering the recipe component only if there is a recipe to show */}
          <div className="recipe-card"> 
           {recipe.map((recipeItem, index) => (
            <RecipeComponent key={index} recipe={recipeItem} />
           ))}
          </div>
        </main>
      </>
    );
}