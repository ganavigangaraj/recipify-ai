 export const MOCK_RECIPEDATA_RESPONSES = {
 
    recipe: {
      success: true,
      data: {
        id:1,
        title: 'Chicken Tomato Garlic Stir Fry',
         
      cuisine: 'Comfort food',
      style: 'mexican',
      prepTime: '30 minutes',
      ingredients: ['chicken', 'tomato', 'garlic'],
        instructions: [
          'Heat oil in a pan',
          'Add garlic and sauté',
          'Add chicken and cook until done',
          'Add tomatoes and simmer'
        ],
     
      }
    }

 
};
 
export const MOCK_RECIPEDATA_RESPONSE = `{
Recipe 1: Chicken Tomato Garlic Skillet
Cuisine: American
Style: Home-style
Prep Time: 15 minutes

Ingredients:
* 4 chicken breasts
* 3 tomatoes
* 4 garlic cloves
* 1 onion (complementary ingredient)
* 2 tbsp olive oil
* Salt and pepper to taste
* 1 tsp dried basil (complementary ingredient)
* 1 tsp dried oregano (complementary ingredient)
* 1 cup chicken broth (complementary ingredient)

Instructions:
1. Heat the olive oil in a skillet over medium-high heat.
2. Add the chicken breasts, season with salt, pepper, basil, and oregano. Cook for 5-7 minutes on each side or until chicken is cooked through.
3. Remove chicken from skillet and set aside.
4. In the same skillet, sauté the diced onion and minced garlic for 2-3 minutes.
5. Add the diced tomatoes, chicken broth, salt, and pepper. Cook for 5 minutes to allow the flavors to meld.
6. Return the chicken to the skillet, cook for another 2 minutes, and serve.

   }`

export  const rawContent = `
                ## 1. Chicken Tikka Masala
                Cuisine: Indian
                Style: Spicy
                Prep Time: 45 minutes
                Ingredients:
                * 500g chicken
                * 200ml cream
                Instructions:
                1. Marinate chicken
                2. Cook in sauce
      `;

export  const mockRecipes = [
        {
          title: 'Test Recipe',
          cuisine: 'Italian',
          style: 'Traditional',
          prepTime: '30 mins',
          ingredients: ['pasta', 'sauce'],
          instructions: ['boil', 'mix']
        }
      ];
export  const mockMultipleRecipes = [
        { title: 'Recipe 1', cuisine: 'Italian', style: 'Quick', prepTime: '20', ingredients: [], instructions: [] },
        { title: 'Recipe 2', cuisine: 'Mexican', style: 'Spicy', prepTime: '30', ingredients: [], instructions: [] }
      ];
      
 
export  const mockRecipesTime = [{ title: 'Test', cuisine: 'Test', style: 'Test', prepTime: '10', ingredients: [], instructions: [] }];

 export const mockAiResponse = {
        message: {
          content: `
                    Recipe 1:
                    Margherita Pizza
                    Cuisine: Italian
                    Style: Traditional
                    Prep Time: 90 minutes
                    Ingredients:
                    * Pizza dough
                    * Tomato sauce
                    * Fresh mozzarella
                    * Basil leaves
                    Instructions:
                    1. Preheat oven to 250C
                    2. Roll out dough
                    3. Add toppings
                    4. Bake for 10 minutes
                `
        }
      };
export const mockAiResponseTwo = {
        message: {
          content: `
Recipe 1:
Recipe One
Cuisine: Italian
Style: Quick
Prep Time: 20 mins
Ingredients:
* Item 1
Instructions:
1. Step 1

Recipe 2:
Recipe Two
Cuisine: Mexican
Style: Spicy
Prep Time: 30 mins
Ingredients:
* Item 2
Instructions:
1. Step 2
          `
        }
      };
export  const rawContent1 = `
Recipe 1:
Test
Cuisine: Test
Style: Test
Prep Time: 10
Ingredients:
- Ingredient without asterisk
* Ingredient with asterisk
Ingredient without bullet
Instructions:
1. Cook
      `;
    
export const rawContent2 = `
Recipe 1:
Test
Cuisine: Test
Style: Test
Prep Time: 10
Ingredients:
* Ingredient
Instructions:
Mix everything
Bake it
      `;
export    const rawContent3 = `
Recipe 1:
Test & Recipe™
Cuisine: French/Italian
Style: Modern-Fusion
Prep Time: 30-45 mins
Ingredients:
* Ingredient with émoji 🍕
Instructions:
1. Step with "quotes"
      `;
      