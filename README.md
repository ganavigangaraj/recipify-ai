**AI Recipe Generator** 

 A full-stack web application that generates personalized recipes based on ingredients provided by the user.

 This project demonstrates modern front-end development practices, clean backend architecture, AI integration, and unit testing. 
 It reflects real-world production patterns including API design, prompt handling, error management, and structured data formatting.

**Project Overview** 

 The AI Recipe Generator allows users to: Enter available ingredients, Generate two unique recipes

**View:**  Recipe name , Complete ingredient list , Preparation steps , Estimated prep time

The application leverages an Hugging face AI model to dynamically create structured recipe content while maintaining consistent formatting for frontend rendering.

**Tech Stack** 
**Frontend** :  React JS, Vite, Tailwind CSS
** Backend** :  Node.js, Express.js

**Hugging Face Inference API**
**Testing** : Jest (Unit testing for backend logic and formatting utilities)

**📂 Architecture Overview**

The application follows a clean separation of concerns:

Client (React) -> REST API (Express) -> AI Model (Hugging Face) -> Response Formatting Layer -> Frontend Rendering

**Key Backend Responsibilities** 
1. Accept ingredient input
2. Construct structured AI prompt
3. Call Hugging Face inference model
4. Parse and format response
5. Return consistent JSON output

**Key Frontend Responsibilities**
1. Handle user input
2. Manage API calls
3. Display structured recipe results
4. Responsive UI design

**✨ Features**
1. Dynamic AI-based recipe generation
2. Generates exactly two structured recipes
3. Clean JSON response formatting
4. Preparation time included
5. Responsive and modern UI
6. Error handling and fallback messaging
7. Unit-tested formatting utilities
8. Environment-based configuration

**🧠 AI Integration**

The backend integrates with the Hugging Face Inference API to generate recipes using a structured prompt.

**The AI response is:**
1. Parsed
2. Converted into structured JSON
3. Validated
4. Returned to the frontend

This ensures predictable rendering and avoids fragile string-based UI parsing.

**Testing Strategy**

Unit testing is implemented using **Jest.**

**Test coverage includes:**
* Recipe parsing logic
* Response formatting
* Edge case handling
* Error handling validation

**Example test coverage areas:**
* Valid AI response parsing
* Empty response handling
* Incorrect format handling
* Structured output validation

**To run tests:**  
           
           npm test


**🛠️ Installation & Setup**

1️⃣ **Clone the repository**:
     
     git clone https://github.com/ganavigangaraj0910-jpg/recipify-ai.git 
     cd ai-recipe-generator

2️⃣ **Backend Setup** : 
     
     cd server
     npm install

**Create a .env file:**

    PORT=5000
    HUGGING_FACE_API_KEY=your_api_key_here

Run the backend:  
      
      npm run dev

3️⃣ **Frontend Setup**
      
    cd client 
    npm install
    npm run dev

**The app will run on:**  http://localhost:5173

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


**🎨 UI Design Approach** 
*  Built with Tailwind CSS for rapid, scalable styling
*  Mobile-first responsive design
*  Clean layout with visual hierarchy
*  Accessible form controls
*  Conditional rendering for loading & error states

**🔒 Environment & Security**
* API keys stored in environment variables
* No secrets exposed to the frontend
* Structured error handling
* Defensive parsing of AI responses


**🔮 Future Improvements** 
* Add user authentication
* Save generated recipes to a database
* Add recipe rating system
* Deploy
* Improve AI prompt tuning for richer outputs
* Add integration tests

  

