const REGEX = {
  recipeHeaderMakrkdown : /###\s+Recipe\s+\d+:\s*/i,
  recipeHeaderPlain : /^Recipe \d+:\s*/im,
  recipeHeaderGeneric : /###\s+\d+\.\s+/,
  title: /^\s*([^\n]+?)\s*(?:\(([^)]+)\))?\s*$/m,
  cuisine: /(?:\*\*)?Cuisine:(?:\*\*)?\s*(.+?)(?:\n|$)/i,
  style: /(?:[-\s]*\*\*)?Style:(?:\*\*)?\s*(.+?)(?:\n|$)/i,
  prepTime: /(?:[-\s]*\*\*)?Prep\s*Time:(?:\*\*)?\s*(.+?)(?:\n|$)/i,
  ingredientsBlock: /[-\s]*\*\*Ingredients?:\*\*\s*\n([\s\S]*?)(?=\n\s*(?:-\s*)?(?:\*\*|####?\s*)Instructions?:|$)/i,
  instructionsBlock: /[-\s]*\*\*Instructions?:\*\*\s*\n([\s\S]*?)(?=\n\s*###|$)/i
}

export async function formatRecipe(aiResponse) {
  const recipeData = aiResponse
  const parsedRecipes = parseRecipes(recipeData)  
  if (parsedRecipes.length === 0) {
    throw new Error("No valid recipes found in the response.")
  } 
  return formatRecipeResponse(parsedRecipes)
}

export function parseRecipes(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return []  
  let recipeSections = []

  if(REGEX.recipeHeaderMakrkdown.test(rawContent)) {
    recipeSections = rawContent.split(REGEX.recipeHeaderMakrkdown).filter(s => s.trim())
  } else if(REGEX.recipeHeaderPlain.test(rawContent)) {
    recipeSections = rawContent.split(REGEX.recipeHeaderPlain).filter(s => s.trim())
  } else if(rawContent.includes('###')) {
    recipeSections = rawContent.split(REGEX.recipeHeaderGeneric).filter(s => s.trim())
  }
  return recipeSections.map(parseRecipeSection).filter(r => r.title && r.ingredients.length > 0 && r.instructions.length > 0)
}


  function parseRecipeSection(section, index) {
    const lines    = section.split('\n').filter(l => l.trim()).filter(Boolean)
    const titleRaw = lines[0].replace(/\*+/g, '').trim() || "Recipe"
    const cuisineInTitle = titleRaw.match(REGEX.title)?.[2]?.replace(/cuisine/i, '').trim()
    const title   = titleRaw.replace(/\([^)]*\)/, '').trim()
    const cuisine = extract(REGEX.cuisine, section) || cuisineInTitle || 'International'
    const style   = extract(REGEX.style, section) || 'Not specified'
    const prepTime = extract(REGEX.prepTime, section) || 'Not specified'
    const ingredients = extractBlock(REGEX.ingredientsBlock, section).map(cleanIngredient)
    const instructions = extractBlock(REGEX.instructionsBlock, section).map(cleanInstruction).filter(validInstruction)
 
   return {
      id: index + 1,
      title,
      cuisine,
      style,
      prepTime,
      ingredients,
      instructions
    }
  
}   
   
// helper functions
function extract(regex, text) {
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractBlock(regex, text) {
  const block = text.match(regex)?.[1]
  return block ? block.split('\n').map(l => l.trim()).filter(l => l.length > 0) : []
}

function cleanIngredient(line) {
  return line.replace(/^[-*\s]+/, '').replace(/\*+/g, '').trim()
}

function cleanInstruction(line) {
  return line.replace(/^\s*\d+\.\s*/, '').replace(/\*\*[^*]+\*\*:?\s*/g, '').trim()
}

function validInstruction(line) {
  const lower = line.toLowerCase()
  return (line.length > 0 &&
    !lower.includes('enjoy your cooking') &&
    !lower.includes('bon appétit') &&
    !lower.includes('enjoy your delicious'))
}

export function formatRecipeResponse(recipes) {
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
  }
}
