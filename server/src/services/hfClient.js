import { InferenceClient } from "@huggingface/inference";

import dotenv from "dotenv";
dotenv.config();

const HF_KEY = process.env.HF_ACCESS_TOKEN;

const client = new InferenceClient(HF_KEY);

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || 'genereate recommended 2 recipes based on the ingredient list'

const USER_PROMPT = process.env.USER_PROMPT

const USED_MODEL = process.env.USED_MODEL 

export async function getRecipeFromMistral(ingredientsArray) {
  const ingredients = ingredientsArray.join(", ");
  try {
    const chatCompletion = await client.chatCompletion({
    provider: "baseten",
    model:USED_MODEL,
     messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients} ${USER_PROMPT}` },
      ],
      max_tokens: 2048,
});

return chatCompletion.choices[0];
  } catch (error) {
    console.log("ERROR HF CLIENT", error)
  }
}


