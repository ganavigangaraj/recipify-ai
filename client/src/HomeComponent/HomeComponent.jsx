import { useEffect, useState,useRef } from "react"
import IngredientComponent from '../components/IngredientComponent/IngredientComponent'
export default function HomeComponent() {
    const buttonText = "Add Ingredient"
    const [ingredients,setIngredients] = useState([])


      function addIngredients(formData){
        formData.preventDefault()
        const newIngredient = formData.get('ingredient')
      setIngredients(prevIngredients => [...prevIngredients, newIngredient])
     }

    const [recipe, setRecipe] = useState("")
    const recipeSection = useRef(null)
 
      const [message, setMessage] = useState('');
     useEffect(() => {
            fetch('/api/data') // This will be proxied to http://localhost:5000/api/data
                .then(response => response.json())
                .then(data => setMessage(data.message))
                .catch(error => console.error('Error fetching data:', error));
        }, []);
    
    const [isLoading, setIsLoading] = useState(false)
    const [error ,setError] = useState(null)
    const [generatedRecipe, setGeneratedRecipe] = useState('');

    async function getRecipe() {
        console.log("RECIPE CLICK")
        setIsLoading(true)
        setError(null) // clear previous error
        try {
            const recipeResponse = await fetch('/api/getRecipe',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ingredients})
            });
          
            const responseData = await recipeResponse.json();
            setGeneratedRecipe(responseData)
        } catch (error) {
            setError(error.message)
            
        }
        setIsLoading(false)
    }

    return (
      <>
        <main className='p-4 font-mono'>
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
            />
          )}
        </main>
        {message}
      </>
    );
}