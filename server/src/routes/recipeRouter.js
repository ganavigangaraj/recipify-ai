import express from 'express'

import { getRecipe } from '../controllers/getRecipe.js'

export const recipeRouter = express.Router()

recipeRouter.post('/getRecipe',getRecipe)