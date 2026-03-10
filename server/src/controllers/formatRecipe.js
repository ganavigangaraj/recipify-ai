export async function formatRecipe(aiResponse) {
    // console.log("aiResponse", aiResponse)

  const recipeData = aiResponse  // aiResponse is already a string from hfClient, no need for .text() or .json() parsing

  const parsedRecipes = parseRecipes(recipeData)
  // console.log("parsedRecipes", parsedRecipes)

  if (parsedRecipes.length === 0) {
    throw new Error("No valid recipes found in the response.")
  }

  return formatRecipeResponse(parsedRecipes)
}

export function parseRecipes(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') return []

  let recipeSections = []

  //   1: Check SPECIFIC format first — "### Recipe N:"
  if (rawContent.match(/###\s+Recipe\s+\d+:/i)) {
    recipeSections = rawContent
      .split(/###\s+Recipe\s+\d+:\s*/i)
      .filter(s => s.trim())
      .slice(1)                    // skip intro text like "Sure, here are..."

  // Plain "Recipe N:" on its own line
  } else if (rawContent.match(/^Recipe \d+:/im)) {
    recipeSections = rawContent
      .split(/^Recipe \d+:\s*/im)
      .filter(s => s.trim())
      .slice(1)

  // "### N." numbered markdown format
  } else if (rawContent.includes('###')) {
    recipeSections = rawContent
      .split(/###\s+\d+\.\s+/)
      .filter(s => s.trim())
      .slice(1)
  }

  return recipeSections.map((section, i) => {

    const lines = section.split('\n').filter(l => l.trim())
    const titleRaw = lines[0].replace(/\*+/g, '').trim()

    //   2: Extract cuisine from title "(Chinese Cuisine)" OR dedicated line
    const cuisineInTitle = titleRaw.match(/\(([^)]+)\)/)?.[1]
                             ?.replace(/cuisine/i, '').trim()
    const title = titleRaw.replace(/\([^)]*\)/,'').trim()

    const cuisineLine = section
      .match(/(?:\*\*)?Cuisine:(?:\*\*)?\s*(.+?)(?:\n|$)/i)?.[1]?.trim()
    const cuisine = cuisineLine || cuisineInTitle || 'International'

    const style = section
      .match(/(?:\*\*)?Style:(?:\*\*)?\s*(.+?)(?:\n|$)/i)?.[1]?.trim()
      || 'Not specified'

    const prepTime = section
      .match(/(?:\*\*)?Prep\s*Time:(?:\*\*)?\s*(.+?)(?:\n|$)/i)?.[1]?.trim()
      || 'Not specified'

    //   3: Regex handles **Ingredients:** AND #### Ingredients:
    const ingBlock = section.match(
      /(?:\*\*|####?\s*)Ingredients?:(?:\*\*)?\s*\n([\s\S]*?)(?=\n\s*(?:\*\*|####?\s*)Instructions?:|$)/i
    )?.[1]
    const ingredients = ingBlock
      ? ingBlock.split('\n')
          .map(l => l.replace(/^[-*\s]+/, '').replace(/\*+/g, '').trim())
          .filter(l => l.length > 0)
      : []

    //   3: Regex handles **Instructions:** AND #### Instructions:
    const instBlock = section.match(
      /(?:\*\*|####?\s*)Instructions?:(?:\*\*)?\s*\n([\s\S]*?)(?=\n\s*###|$)/i
    )?.[1]
    const instructions = instBlock
      ? instBlock.split('\n')
          .map(l => l
            .replace(/^\d+\.\s*/, '')
            .replace(/\*\*[^*]+\*\*:?\s*/g, '')
            .trim()
          )
          .filter(l => {
            const c = l.toLowerCase()
            return l.length > 0 &&
              !c.includes('enjoy your cooking') &&
              !c.includes('bon appétit') &&
              !c.includes('enjoy your delicious')
          })
      : []

    return { id: i + 1, title, cuisine, style, prepTime, ingredients, instructions }

  //  cuisine removed from required fields — only need title + ingredients + instructions
  }).filter(r => r.title && r.ingredients.length > 0 && r.instructions.length > 0)
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