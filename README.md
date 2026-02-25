AI Recipe Generator

 A full-stack web application that generates personalized recipes based on ingredients provided by the user.

This project demonstrates modern front-end development practices, clean backend architecture, AI integration, and unit testing. It reflects real-world production patterns including API design, prompt handling, error management, and structured data formatting.

Project Overview

The AI Recipe Generator allows users to:

Enter available ingredients

Generate two unique recipes

View:

Recipe name

Complete ingredient list

Preparation steps

Estimated prep time

The application leverages an AI model to dynamically create structured recipe content while maintaining consistent formatting for frontend rendering.

Tech Stack
Frontend

React JS

Vite

Tailwind CSS

Backend

Node.js

Express.js

Hugging Face Inference API

Testing

Jest (Unit testing for backend logic and formatting utilities)

📂 Architecture Overview

The application follows a clean separation of concerns:

Client (React)
    ↓
REST API (Express)
    ↓
AI Model (Hugging Face)
    ↓
Response Formatting Layer
    ↓
Frontend Rendering

Key Backend Responsibilities

Accept ingredient input

Construct structured AI prompt

Call Hugging Face inference model

Parse and format response

Return consistent JSON output

Key Frontend Responsibilities

Handle user input

Manage API calls

Display structured recipe results

Responsive UI design

✨ Features

Dynamic AI-based recipe generation

Generates exactly two structured recipes

Clean JSON response formatting

Preparation time included

Responsive and modern UI

Error handling and fallback messaging

Unit-tested formatting utilities

Environment-based configuration

🧠 AI Integration

The backend integrates with the Hugging Face Inference API to generate recipes using a structured prompt.

The AI response is:

Parsed

Converted into structured JSON

Validated

Returned to the frontend

This ensures predictable rendering and avoids fragile string-based UI parsing.


Testing Strategy

Unit testing is implemented using Jest.

Test coverage includes:

Recipe parsing logic

Response formatting

Edge case handling

Error handling validation

Example test coverage areas:

Valid AI response parsing

Empty response handling

Incorrect format handling

Structured output validation

To run tests:

npm test


🛠️ Installation & Setup
1️⃣ Clone the repository
git clone <your-repo-url>
cd ai-recipe-generator
2️⃣ Backend Setup
cd server
npm install

Create a .env file:

PORT=5000
HUGGING_FACE_API_KEY=your_api_key_here

Run the backend:

npm run dev
3️⃣ Frontend Setup
cd client
npm install
npm run dev

The app will run on:

http://localhost:5173
📡 API Endpoint
POST /api/recipes
Request Body
{
  "ingredients": "chicken, tomato, garlic"
}
Response Format
{
  "recipes": [
    {
      "title": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": "30 minutes"
    },
    {
      "title": "Recipe Name",
      "ingredients": ["ingredient 1", "ingredient 2"],
      "instructions": ["step 1", "step 2"],
      "prepTime": "25 minutes"
    }
  ]
}
🎨 UI Design Approach

Built with Tailwind CSS for rapid, scalable styling

Mobile-first responsive design

Clean layout with visual hierarchy

Accessible form controls

Conditional rendering for loading & error states

🔒 Environment & Security

API keys stored in environment variables

No secrets exposed to the frontend

Structured error handling

Defensive parsing of AI responses

📈 Why This Project Matters

This project demonstrates:

Full-stack development capability

AI API integration

Clean architecture principles

Production-style API response formatting

Defensive coding practices

Unit testing discipline

Modern React development patterns

It reflects practical, real-world implementation rather than tutorial-level experimentation.

🔮 Future Improvements

Add user authentication

Save generated recipes to a database

Add recipe rating system

Deploy using Docker

Improve AI prompt tuning for richer outputs

Add integration tests

