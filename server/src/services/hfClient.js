import "dotenv/config";

import { InferenceClient } from "@huggingface/inference";

export async function getRecipeFromMistral(ingredientsArray) {
  const HF_KEY = process.env.HF_ACCESS_TOKEN;

  const client = new InferenceClient(HF_KEY);

  const SYSTEM_PROMPT =
    process.env.SYSTEM_PROMPT ||
    "Generate recipes using the provided ingredient list. Ensure at least two recipes prioritize the given ingredients. You may add minimal complementary ingredients if required. For every recipe return cuisine, style, prep time, ingredients, and instructions in a structured format suitable for frontend rendering.";

  const USER_PROMPT = process.env.USER_PROMPT;

  const USED_MODEL = process.env.USED_MODEL;
  const ingredients = ingredientsArray.join(", ");
  try {
    const chatCompletion = await client.chatCompletion({
      provider: "together",
      model: USED_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients} ${USER_PROMPT}` },
      ],
      timeout: 60000, // 60 seconds
      max_tokens: 2048,
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.log("Error from the Hugging Face client", error);
    throw error;
  }
}
