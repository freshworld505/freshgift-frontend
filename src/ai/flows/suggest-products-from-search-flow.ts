
'use server';
/**
 * @fileOverview AI flow to suggest products or related terms based on a user's search query.
 *
 * - suggestProductsFromSearch - A function that suggests product ideas.
 * - SuggestProductsFromSearchInput - The input type for the function.
 * - SuggestProductsFromSearchOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestProductsFromSearchInputSchema = z.object({
  searchQuery: z.string().describe('The user\'s original search query that yielded few or no results.'),
  currentCartItems: z.array(z.string()).optional().describe('Optional: A list of product names already in the user\'s cart to provide context.'),
});
export type SuggestProductsFromSearchInput = z.infer<typeof SuggestProductsFromSearchInputSchema>;

const SuggestProductsFromSearchOutputSchema = z.object({
  suggestedIdeas: z
    .array(z.string())
    .describe('A list of 3-5 product ideas, alternative search terms, or related categories relevant to the user\'s original query.'),
});
export type SuggestProductsFromSearchOutput = z.infer<typeof SuggestProductsFromSearchOutputSchema>;

export async function suggestProductsFromSearch(
  input: SuggestProductsFromSearchInput
): Promise<SuggestProductsFromSearchOutput> {
  return suggestProductsFromSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestProductsFromSearchPrompt',
  input: {schema: SuggestProductsFromSearchInputSchema},
  output: {schema: SuggestProductsFromSearchOutputSchema},
  prompt: `You are a friendly and helpful shopping assistant for "FreshGift", an online grocery store specializing in fresh fruits and vegetables.
A user searched for "{{{searchQuery}}}" but found few or no matching products in our current catalog.
{{#if currentCartItems}}
The user currently has the following items in their cart, which might give context to their search:
{{#each currentCartItems}}
- {{{this}}}
{{/each}}
Based on this, and their original search query ("{{{searchQuery}}}"), please provide 3-5 helpful suggestions.
{{else}}
Based on their original search query ("{{{searchQuery}}}"), please provide 3-5 helpful suggestions.
{{/if}}

These suggestions should help them find what they might be looking for, or discover related items. Suggestions can be:
- Alternative ways to phrase their search for fresh produce (e.g., "seasonal greens" instead of a very specific type of lettuce).
- Broader categories of fruits or vegetables they might be interested in (e.g., "root vegetables", "citrus fruits").
- Specific types of fruits or vegetables that are related to their query (e.g., if searching "sweet potatoes", suggest "yams" or "butternut squash").
- Ideas for what they might be trying to make or achieve with their search, and what produce would fit (e.g., if "stir-fry veggies", suggest "bell peppers, broccoli, snap peas").

Focus entirely on fresh fruits and vegetables. Keep suggestions concise, actionable, and encouraging.
Do not suggest products that are very similar to the original query if it's too specific and not found; instead, broaden the scope or suggest complementary items.
Example: If query is "exotic purple carrot variety X", suggest "purple vegetables", "different types of carrots", or "rainbow vegetable medley".
Example: If query is "quick salad", suggest "romaine lettuce hearts", "cherry tomatoes", "mini cucumbers", or "pre-washed spinach".

Return the suggestions as a list of strings in the 'suggestedIdeas' field.
`,
});

const suggestProductsFromSearchFlow = ai.defineFlow(
  {
    name: 'suggestProductsFromSearchFlow',
    inputSchema: SuggestProductsFromSearchInputSchema,
    outputSchema: SuggestProductsFromSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

