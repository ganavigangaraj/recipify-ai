import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { formatRecipe,parseRecipes,formatRecipeResponse } from '../../controllers/formatRecipe.js';
import * as mockData from './formatRecipeMockData.js'

describe('Formatting Recipe Response', () =>{
     beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Parsing the recipe',() =>{
  test('1. Should parse  the response  ',() =>{
    const response = parseRecipes(mockData.MOCK_RECIPEDATA_RESPONSE);
    expect(response).toHaveLength(1);
      expect(response[0].title).toBe('Chicken Tomato Garlic Skillet');
      //optional
      // expect(response[0].cuisine).toBe('American');
      // expect(response[0].ingredients).toHaveLength(9);
      // expect(response[0].instructions).toHaveLength(7);
  })
  // 10% to coverage
  test('2 Should parse recipe with "## N." markdown pattern', () => {
      const result = parseRecipes(mockData.rawContent);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Chicken Tikka Masala');
      expect(result[0].cuisine).toBe('Indian');
    });
  })

  describe('Format the parsed data ', () =>{
    test('1 Should format the parsed recipe data', () =>{
     const formatParsed = formatRecipeResponse(mockData.mockRecipes);
      expect(formatParsed).toHaveProperty('success',true)
      expect(formatParsed).toHaveProperty('count', 1);
      expect(formatParsed).toHaveProperty('data');
      expect(formatParsed).toHaveProperty('timestamp');
      expect(formatParsed.data[0]).toHaveProperty('id', 1);
    })

    // did not changed the coverage lines
       test('2 Should assign sequential IDs to multiple recipes', () => {
      const result = formatRecipeResponse(mockData.mockMultipleRecipes);
      expect(result.count).toBe(2);
      expect(result.data[0].id).toBe(1);
      expect(result.data[1].id).toBe(2);
    });
// did not changed the covered lines
      test('3 Should include timestamp in ISO format', () => {
      const result = formatRecipeResponse(mockData.mockRecipesTime);
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(() => new Date(result.timestamp)).not.toThrow();
    });
    // did not changed the covered lines
      test('4 Should handle empty recipe array', () => {
      const result = formatRecipeResponse([]);
      expect(result.success).toBe(true);
      expect(result.count).toBe(0);
      expect(result.data).toEqual([]);
    });
  })

  //  integration for  formatRecipe()
  describe('Format recipe integration ' ,() =>{
        // changed 10% line coverage
    test('1 Should process complete AI response successfully', async () => {
      const result = await formatRecipe(mockData.mockAiResponse);
      expect(result.success).toBe(true);
      expect(result.count).toBe(1);
      expect(result.data[0].title).toBe('Margherita Pizza');
      expect(result.data[0].ingredients).toHaveLength(4);
    });
// 4% line coverage
       test('2 Should handle missing message.content gracefully', async () => {
      const mockAiResponse = { message: {} };
      const result = await formatRecipe(mockAiResponse);
      expect(result.success).toBe(true);
      expect(result.count).toBe(0);
      expect(result.data).toEqual([]);
    });

    // no change in coverage
     test('3 Should handle null AI response', async () => {
      const mockAiResponse = null;
      await expect(formatRecipe(mockAiResponse)).rejects.toThrow();
    });

    // no change to coverage
      test('4 Should process multiple recipes from AI response', async () => {
      const result = await formatRecipe(mockData.mockAiResponseTwo);
      expect(result.count).toBe(2);
      expect(result.data).toHaveLength(2);
    });
    
  })
  // EDGE CASES & ERROR HANDLING
  // no change to covering
  describe('Edge Cases', () => {
    
    test('1 Should handle malformed ingredient bullets', () => {
      const result = parseRecipes(mockData.rawContent1);
      expect(result[0].ingredients.length).toBeGreaterThan(0);
    });
    
    test('2 Should handle instructions without numbers', () => {
      const result = parseRecipes(mockData.rawContent2);
      expect(result[0].instructions.length).toBeGreaterThan(0);
    });
    
    test('3 Should handle special characters in recipe content', () => {
      const result = parseRecipes(mockData.rawContent3);
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('&');
    });
  });

}
)
