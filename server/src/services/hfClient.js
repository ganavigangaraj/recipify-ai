import { InferenceClient } from "@huggingface/inference";

import dotenv from "dotenv";
dotenv.config();

// const USED_MODEL = import.meta.env.USED_MODEL;
export async function getRecipeFromMistral(ingredientsArray) {
  
const HF_KEY = process.env.HF_ACCESS_TOKEN ; // 👈 DEFAULT VALUE ADDED HERE

const client = new InferenceClient(HF_KEY);

const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || 'Generate recipes using the provided ingredient list. Ensure at least two recipes prioritize the given ingredients. You may add minimal complementary ingredients if required. For every recipe return cuisine, style, prep time, ingredients, and instructions in a structured format suitable for frontend rendering.'

const USER_PROMPT = process.env.USER_PROMPT

const USED_MODEL = process.env.USED_MODEL 
  const ingredients = ingredientsArray.join(", ");
  try {
    const chatCompletion = await client.chatCompletion({
    provider: "together",
    model:"Qwen/Qwen2.5-7B-Instruct",
     messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `I have ${ingredients} ${USER_PROMPT}` },
      ],
      timeout: 60000 , // 60 seconds
      max_tokens: 2048,
});
return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.log("error from the Hugging face model", error)
    throw error; 
  }
}


