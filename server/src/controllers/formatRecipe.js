
export async function formatRecipe(aiResponse) {
  console.log("aiResponse",aiResponse)
  const recipeData = aiResponse.message && aiResponse.message.content;
  // Parse the raw content
  // if(!recipeData) throw new Error("No Response is recived");
    const parsedRecipes = parseRecipes(recipeData);
    // Format the response
    const formattedRecipe = formatRecipeResponse(parsedRecipes);
   return formattedRecipe;

  //  if (aiResponse === null) throw new Error('aiResponse is required'); // keep tests consistent
  // const recipeData = aiResponse.message && aiResponse.message.content;
  // const parsedRecipes = parseRecipes(recipeData || '');
  // return formatRecipeResponse(parsedRecipes);
}
/**
 * Parse raw recipe content into structured format
 * @param {string} rawContent - Raw recipe text from AI/source
 * @returns {Array} Array of formatted recipe objects
 */
export  function parseRecipes(rawContent) {
  const recipes = [];
  
  // Split by different recipe patterns
  let recipeSections = [];
   if (!rawContent || typeof rawContent !== 'string'){
    return [];
   } else{
  // Try pattern 1: "Recipe N:" format
  if (rawContent.includes('Recipe 1:')) {
    recipeSections = rawContent.split(/Recipe \d+:/i).filter(s => s.trim());
  }
  // Try pattern 2: "## N." markdown format
  else if (rawContent.includes('##')) {
    recipeSections = rawContent.split(/##\s+\d+\.\s+/).filter(s => s.trim());
  }
  
  recipeSections.forEach(section => {
    try {
      const recipe = {};
      
      // Extract title (first line)
      const lines = section.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;
      
      recipe.title = lines[0].trim();
      
      // Extract cuisine
      const cuisineMatch = section.match(/Cuisine:\s*(.+?)(?:\n|$)/i);
      recipe.cuisine = cuisineMatch ? cuisineMatch[1].trim() : 'Not specified';
      
      // Extract style
      const styleMatch = section.match(/Style:\s*(.+?)(?:\n|$)/i);
      recipe.style = styleMatch ? styleMatch[1].trim() : 'Not specified';
      
      // Extract prep time
      const prepTimeMatch = section.match(/Prep Time:\s*(.+?)(?:\n|$)/i);
      recipe.prepTime = prepTimeMatch ? prepTimeMatch[1].trim() : 'Not specified';
      
      // Extract ingredients
      const ingredientsMatch = section.match(/Ingredients:\s*\n([\s\S]*?)(?=\n\s*Instructions:|$)/i);
      if (ingredientsMatch) {
        recipe.ingredients = ingredientsMatch[1]
          .split('\n')
          .map(line => line.replace(/^\*\s*/, '').trim())
          .filter(line => line.length > 0);
      } else {
        recipe.ingredients = [];
      }
      
      // Extract instructions
      const instructionsMatch = section.match(/Instructions:\s*\n([\s\S]*?)$/i);
      if (instructionsMatch) {
        recipe.instructions = instructionsMatch[1]
          .split('\n')
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(line => {
            const cleaned = line.toLowerCase();
            return line.length > 0 && 
                   !cleaned.includes('enjoy your cooking') &&
                   !cleaned.includes('bon appétit') &&
                   !cleaned.includes('happy cooking');
          });
      } else {
        recipe.instructions = [];
      }
      
      // Only add valid recipes with all required fields
      if (recipe.title && 
          recipe.cuisine !== 'Not specified' &&
          recipe.ingredients.length > 0 && 
          recipe.instructions.length > 0) {
        recipes.push(recipe);
      }
    } catch (error) {
      console.error('Error parsing recipe section:', error);
    }
  });
  
  return recipes;
   }

}


/**
 * Format recipe response for frontend consumption
 * @param {Object} parsedData - Object containing recipes, acknowledgeMessage, and enjoyMessage
 * @returns {Object} Formatted API response
 */
export  function formatRecipeResponse(recipes) {  
  return {
    success: true,
    count: recipes.length,
    data: recipes.map((recipe, index) => ({
      id: index + 1,
      title: recipe.title,
      cuisine: recipe.cuisine,
      style: recipe.style,
      prepTime: recipe.prepTime,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions
    })),
    timestamp: new Date().toISOString()
  };
}


