//   recipeService.js - handles all API calls related to recipes,
//  currently just fetching recipes based on ingredients.
//  It abstracts away the details of the API endpoint and response handling from the rest of the app,
//  providing a clean interface for components to use when they need recipe data.
//  This separation of concerns makes the codebase more maintainable and easier to test.


const API_BASE_URL = '/api'  // vite proxy forwards this to localhost:4000

/**
 * Fetches recipes from the backend based on ingredients
 * @param {string[]} ingredients - array of ingredient strings
 * @returns {Promise<Object[]>} - array of recipe objects
 */
export async function fetchRecipes(ingredients) {

  const response = await fetch(`${API_BASE_URL}/getRecipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })

  // Handle HTTP errors (4xx, 5xx)
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(
      errData.error || `Server error: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  // Validate the response shape
  if (!data.success || !Array.isArray(data.data)) {
    throw new Error('Unexpected response format from server')
  }

  return data.data  // return just the recipes array  
}