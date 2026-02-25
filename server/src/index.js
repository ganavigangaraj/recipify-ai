import express from 'express'
import { recipeRouter  } from './routes/recipeRouter.js'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
const app  = express()
const PORT = process.env.PORT || 4000;

app.use(express.json());

/* To make the request available to all other origin */
app.use(cors())
   app.get('/api/data', (req, res) => {
        res.json({ message: 'Hello from the backend!' });
    });
app.use('/api',recipeRouter)

/* Fallback response if the root is not found. Order is maintained since the routing is read from top to bottom of the server.js file */
app.use((request,response)=> {
    response.status(404).json({
        messsage : 'End point not found.Please check the API documentation.'
    })
})



export default app; // Important for testing
