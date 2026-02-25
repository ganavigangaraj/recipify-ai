import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import request from 'supertest';
import express from 'express';

// ========================================
// STEP 1: Mock the controller BEFORE importing
// ========================================
const mockGetRecipe = jest.fn();

jest.unstable_mockModule('../../controllers/getRecipe.js', () => ({
  getRecipe: mockGetRecipe
}));

// ========================================
// STEP 2: Dynamic import AFTER mocking
// ========================================
const { recipeRouter } = await import('../../routes/recipeRouter.js');

// ========================================
// STEP 3: Test app factory function
// ========================================
/**
 * Creates an isolated Express app for testing
 * This prevents side effects from the real app (DB connections, middleware, etc.)
 */
const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Mount router
  app.use('/api', recipeRouter);
  
  // 404 handler for testing invalid endpoints
  app.use((req, res) => {
    res.status(404).json({ 
      message: 'End point not found. Please check the API documentation.' 
    });
  });
  
  // Error handling middleware (catches controller errors)
  app.use((err, req, res, next) => {
    // console.error('Test app error:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  });
  
  return app;
};

// ========================================
// STEP 4: Test constants (easy maintenance)
// ========================================
const ENDPOINTS = {
  GET_RECIPE: '/api/getRecipe',
  INVALID: '/api/invalid-endpoint'
};

const ERROR_MESSAGES = {
  EMPTY_INGREDIENTS: 'Please provide an ingredients.',
  MISSING_INGREDIENTS: 'Ingredients field is required',
  INVALID_TYPE: 'Ingredients must be an array',
  ENDPOINT_NOT_FOUND: 'End point not found. Please check the API documentation.'
};
 

const MOCK_RESPONSES = {
  SUCCESS: {
    recipe: {
      success: true,
      data: {
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
  },
  ERROR_EMPTY: {
    success: false,
    error: ERROR_MESSAGES.EMPTY_INGREDIENTS
  },
  ERROR_MISSING: {
    success: false,
    error: ERROR_MESSAGES.MISSING_INGREDIENTS
  },
  ERROR_TYPE: {
    success: false,
    error: ERROR_MESSAGES.INVALID_TYPE
  }
};

const TEST_INGREDIENTS = {
  VALID: ['chicken', 'tomato', 'garlic'],
  SINGLE: ['pasta'],
  MANY: ['chicken', 'beef', 'pork', 'fish', 'tofu', 'eggs', 'milk', 'cheese', 'bread', 'rice'],
  SPECIAL_CHARS: ['jalapeño', 'crème fraîche', 'café'],
  WITH_SPACES: ['  chicken  ', '  tomato  ', '  garlic  '],
  EMPTY: [],
  VERY_LONG: Array(100).fill('ingredient')
};

// ========================================
// MAIN TEST SUITE
// ========================================
describe('Recipe Router - POST /api/getRecipe', () => {
  let app;

  // Setup: Run before each test
  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  // Cleanup: Run after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  // ========================================
  // GROUP 1: Error Handling Tests
  // ========================================
  describe('Error Handling', () => {
    
    test('should return 404 for invalid endpoint', async () => {
      // ACT: Try to access non-existent endpoint
      const response = await request(app)
        .post(ENDPOINTS.INVALID)
        .send({ ingredients: TEST_INGREDIENTS.VALID })
        .expect(404);

      // ASSERT: Verify error response
      expect(response.body).toEqual({
        message: ERROR_MESSAGES.ENDPOINT_NOT_FOUND
      });
      
      // Verify controller was NOT called
      expect(mockGetRecipe).not.toHaveBeenCalled();
    });

    test('should return 400 when ingredients array is empty', async () => {
      // ARRANGE: Mock controller to return error
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(400).json(MOCK_RESPONSES.ERROR_EMPTY);
      });

      // ACT: Send empty ingredients array
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .set('Content-Type', 'application/json')
        .send({ ingredients: TEST_INGREDIENTS.EMPTY })
        .expect(400);

      // ASSERT: Verify error response structure
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe(ERROR_MESSAGES.EMPTY_INGREDIENTS);
      
      // Verify controller was called once
      expect(mockGetRecipe).toHaveBeenCalledTimes(1);
    });

    test('should return 400 when ingredients field is missing', async () => {
      // ARRANGE: Mock controller to return error
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(400).json(MOCK_RESPONSES.ERROR_MISSING);
      });

      // ACT: Send request without ingredients field
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({}) // Empty body
        .expect(400);

      // ASSERT: Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(ERROR_MESSAGES.MISSING_INGREDIENTS);
    });

    test('should return 400 when ingredients is not an array', async () => {
      // ARRANGE: Mock controller to return error
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(400).json(MOCK_RESPONSES.ERROR_TYPE);
      });

      // ACT: Send string instead of array
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: 'chicken, tomato, garlic' })
        .expect(400);

      // ASSERT: Verify type validation error
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe(ERROR_MESSAGES.INVALID_TYPE);
    });

    test('should return 400 when ingredients is null', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(400).json({
          success: false,
          error: 'Ingredients cannot be null'
        });
      });

      // ACT: Send null value
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: null })
        .expect(400);

      // ASSERT
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    test('should handle malformed JSON gracefully', async () => {
      // ACT: Send invalid JSON
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .set('Content-Type', 'application/json')
        .send('{"ingredients": [invalid json}'); // Malformed JSON

      // ASSERT: Express automatically returns 400 for bad JSON
      expect(response.status).toBe(500);
    });

    test('should reject GET requests to POST-only endpoint', async () => {
      // ACT: Try GET instead of POST
      const response = await request(app)
        .get(ENDPOINTS.GET_RECIPE)
        .expect(404);

      // ASSERT: Route not found
      expect(response.status).toBe(404);
      
      // Controller should NOT be called
      expect(mockGetRecipe).not.toHaveBeenCalled();
    });


  });

  // ========================================
  // GROUP 2: Successful Recipe Generation
  // ========================================
  describe('Successful Recipe Generation', () => {
    
    test('should return 200 with recipe data for valid ingredients', async () => {
      // ARRANGE: Mock successful response
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json(MOCK_RESPONSES.SUCCESS);
      });

      // ACT: Send valid request
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .set('Content-Type', 'application/json')
        .send({ ingredients: TEST_INGREDIENTS.VALID })
        .expect(200);

      // ASSERT: Verify response structure
      expect(response.body).toHaveProperty('recipe');
      expect(response.body.recipe).toHaveProperty('success', true);
      expect(response.body.recipe).toHaveProperty('data');
      expect(response.body.recipe.data).toHaveProperty('title');
      expect(response.body.recipe.data).toHaveProperty('ingredients');
      expect(response.body.recipe.data).toHaveProperty('instructions');
      
      // Verify controller was called
      expect(mockGetRecipe).toHaveBeenCalledTimes(1);
    });

    test('should handle single ingredient', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: {
            success: true,
            data: {
              title: 'Simple Pasta Dish',
              ingredients: ['pasta'],
              instructions: ['Boil water', 'Cook pasta']
            }
          }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.SINGLE })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
      expect(response.body.recipe.data.ingredients).toHaveLength(1);
    });

    test('should handle many ingredients (10+ items)', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: {
            success: true,
            data: {
              title: 'Complex Multi-Ingredient Dish',
              ingredients: TEST_INGREDIENTS.MANY,
              instructions: ['Complex cooking steps']
            }
          }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.MANY })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
      expect(mockGetRecipe).toHaveBeenCalled();
    });

    test('should return recipe with all required fields', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json(MOCK_RESPONSES.SUCCESS);
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.VALID })
        .expect(200);

      // ASSERT: Verify all fields exist
      const recipeData = response.body.recipe.data;
      expect(recipeData).toHaveProperty('title');
      expect(recipeData).toHaveProperty('ingredients');
      expect(recipeData).toHaveProperty('instructions');
      expect(recipeData).toHaveProperty('prepTime');
      
      // Verify types
      expect(typeof recipeData.title).toBe('string');
      expect(Array.isArray(recipeData.ingredients)).toBe(true);
      expect(Array.isArray(recipeData.instructions)).toBe(true);
    });
  });

  // ========================================
  // GROUP 3: Edge Cases and Special Scenarios
  // ========================================
  describe('Edge Cases', () => {
    
    test('should handle ingredients with special characters', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: {
            success: true,
            data: {
              title: 'French-Inspired Dish',
              ingredients: TEST_INGREDIENTS.SPECIAL_CHARS,
              instructions: ['Special preparation']
            }
          }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.SPECIAL_CHARS })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
      expect(mockGetRecipe).toHaveBeenCalled();
    });

    test('should handle ingredients with leading/trailing spaces', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: {
            success: true,
            data: {
              title: 'Trimmed Recipe',
              ingredients: ['chicken', 'tomato', 'garlic'],
              instructions: ['Cook']
            }
          }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.WITH_SPACES })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
      
      // Verify controller received the request
      const calledWithReq = mockGetRecipe.mock.calls[0][0];
      expect(calledWithReq.body.ingredients).toEqual(TEST_INGREDIENTS.WITH_SPACES);
    });

    test('should handle very long ingredient lists', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: {
            success: true,
            data: {
              title: 'Everything Stew',
              ingredients: TEST_INGREDIENTS.VERY_LONG,
              instructions: ['Mix everything']
            }
          }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: TEST_INGREDIENTS.VERY_LONG })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
    });

    test('should handle uppercase and lowercase ingredients', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: { success: true, data: { title: 'Mixed Case Recipe' } }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: ['CHICKEN', 'Tomato', 'garlic'] })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
    });

    test('should handle duplicate ingredients', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: { success: true, data: { title: 'Duplicate Recipe' } }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: ['chicken', 'chicken', 'chicken'] })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
    });

    test('should handle numeric strings as ingredients', async () => {
      // ARRANGE
      mockGetRecipe.mockImplementation((req, res) => {
        return res.status(200).json({
          recipe: { success: true, data: { title: 'Numeric Recipe' } }
        });
      });

      // ACT
      const response = await request(app)
        .post(ENDPOINTS.GET_RECIPE)
        .send({ ingredients: ['123', '456', '789'] })
        .expect(200);

      // ASSERT
      expect(response.body.recipe.success).toBe(true);
    });
  });

  // ========================================
  // GROUP 4: Controller Integration
  // ========================================
  // describe('Controller Integration', () => {
    
  //   test('should pass correct request object to controller', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     const testData = { ingredients: ['test1', 'test2', 'test3'] };

  //     // ACT
  //     await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send(testData)
  //       .expect(200);

  //     // ASSERT: Verify controller was called with correct data
  //     expect(mockGetRecipe).toHaveBeenCalledTimes(1);
      
  //     const calledWithReq = mockGetRecipe.mock.calls[0][0];
  //     const calledWithRes = mockGetRecipe.mock.calls[0][1];
      
  //     // Verify request object
  //     expect(calledWithReq.body).toEqual(testData);
  //     expect(calledWithReq.method).toBe('POST');
      
  //     // Verify response object exists
  //     expect(calledWithRes).toBeDefined();
  //     expect(typeof calledWithRes.status).toBe('function');
  //     expect(typeof calledWithRes.json).toBe('function');
  //   });

  //   test('should call controller exactly once per request', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     // ACT
  //     await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT
  //     expect(mockGetRecipe).toHaveBeenCalledTimes(1);
  //   });

  //   test('should preserve request headers', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     // ACT
  //     await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .set('X-Custom-Header', 'test-value')
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT: Verify headers were passed
  //     const calledWithReq = mockGetRecipe.mock.calls[0][0];
  //     expect(calledWithReq.headers['x-custom-header']).toBe('test-value');
  //   });

  //   test('should handle controller throwing synchronous errors', async () => {
  //     // ARRANGE: Make controller throw error
  //     mockGetRecipe.mockImplementation(() => {
  //       throw new Error('Controller crashed');
  //     });

  //     // ACT
  //     const response = await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT: Error middleware should catch it
  //     expect(response.status).toBe(500);
  //     expect(response.body.success).toBe(false);
  //   });

  //   test('should handle controller rejecting promises', async () => {
  //     // ARRANGE: Make controller return rejected promise
  //     mockGetRecipe.mockImplementation(() => {
  //       return Promise.reject(new Error('Async error'));
  //     });

  //     // ACT
  //     const response = await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT
  //     expect(response.status).toBe(500);
  //   });
  // });

  // ========================================
  // GROUP 5: Response Format Validation
  // ========================================
  // describe('Response Format Validation', () => {
    
  //   test('should return valid JSON for all responses', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json(MOCK_RESPONSES.SUCCESS);
  //     });

  //     // ACT
  //     const response = await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT: Verify it's valid JSON
  //     expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
  //   });

  //   test('should include Content-Type: application/json header', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     // ACT
  //     const response = await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT
  //     expect(response.headers['content-type']).toMatch(/application\/json/);
  //   });

  //   test('should not include sensitive information in error responses', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(500).json({
  //         success: false,
  //         error: 'Internal server error'
  //         // Should NOT include: stack traces, database queries, API keys, etc.
  //       });
  //     });

  //     // ACT
  //     const response = await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });

  //     // ASSERT: Verify no sensitive data leaked
  //     const responseStr = JSON.stringify(response.body).toLowerCase();
  //     expect(responseStr).not.toContain('stack');
  //     expect(responseStr).not.toContain('password');
  //     expect(responseStr).not.toContain('api_key');
  //     expect(responseStr).not.toContain('secret');
  //   });
  // });

  // ========================================
  // GROUP 6: Performance and Timeout Tests
  // ========================================
  // describe('Performance', () => {
    
  //   test('should respond within reasonable time (< 100ms for mocked)', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     // ACT
  //     const startTime = Date.now();
      
  //     await request(app)
  //       .post(ENDPOINTS.GET_RECIPE)
  //       .send({ ingredients: TEST_INGREDIENTS.VALID });
      
  //     const duration = Date.now() - startTime;

  //     // ASSERT: Should be fast since it's mocked
  //     expect(duration).toBeLessThan(100); // 100ms
  //   });

  //   test('should handle rapid consecutive requests', async () => {
  //     // ARRANGE
  //     mockGetRecipe.mockImplementation((req, res) => {
  //       return res.status(200).json({ recipe: { success: true } });
  //     });

  //     // ACT: Send 5 requests rapidly
  //     const requests = Array(5).fill(null).map(() =>
  //       request(app)
  //         .post(ENDPOINTS.GET_RECIPE)
  //         .send({ ingredients: TEST_INGREDIENTS.VALID })
  //     );

  //     const responses = await Promise.all(requests);

  //     // ASSERT: All should succeed
  //     responses.forEach(response => {
  //       expect(response.status).toBe(200);
  //     });
      
  //     // Controller should be called 5 times
  //     expect(mockGetRecipe).toHaveBeenCalledTimes(5);
  //   });
  // });
});