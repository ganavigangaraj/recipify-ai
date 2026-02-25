export default function IngredientComponent(props){
        const ingredientsListItems = props.ingredients.map((ingredient,id)=>{
            return (
              ingredient &&  <li key={id}>{ingredient}</li>
            )
     })
    return(

        <section>
                <h2 className="pt-2 text-xl  font-medium ">Ingredients on hand:</h2>
                <ul className="mb-12 leading-7 pl-3" aria-live="polite">{ingredientsListItems}</ul>
                {/* rendering the container only if there are more than 3 items in the list */}
                {props.ingredients.length > 3 && <div className="flex justify-between items-center bg-gray-200 rounded-md p-4">
                    <div ref={props.ref} >
                        <h3 className="text-xl  font-medium ">Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button  onClick={props.getRecipe} className="bg-orange-500 rounded-md text-xl text-white font-medium p-2 text-center">Get a recipe</button>
                   {props.loading ? <span> 'Loading...' </span> : <span>'Fetching'</span>} 
                    {props.error && <p style={{ color: 'red' }}>Error: {props.error}</p>}
                </div>}
              
            </section>
    )
}