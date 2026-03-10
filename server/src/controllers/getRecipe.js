import { getRecipeFromMistral } from "../services/hfClient.js";
import { formatRecipe } from "./formatRecipe.js";

export async function getRecipe(req, res) {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: "Please provide an ingredients." });
    }
    const aiResponse = await getRecipeFromMistral(ingredients)
    console.log("AI RESPONSE", aiResponse);
    const recipeData =  await formatRecipe(aiResponse)
    // return res.status(200).json({
    //   success: true,
    //   recipe:recipeData, 
    // });
// ✅ AFTER — just send recipeData directly
return res.status(200).json(recipeData);
  } catch (err) {
    console.error("Error in getRecipe:", err);
    res.status(500).json({ error: "Server error" });
  }
}
