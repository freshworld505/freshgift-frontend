'use server';

/**
 * @fileOverview AI flow to recommend complementary products based on items in the cart.
 *
 * - recommendComplementaryProducts - A function that recommends products.
 * - RecommendComplementaryProductsInput - The input type for the recommendComplementaryProducts function.
 * - RecommendComplementaryProductsOutput - The return type for the recommendComplementaryProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendComplementaryProductsInputSchema = z.object({
  productName: z.string().describe('The name of the product in the cart.'),
  productCategory: z.string().describe('The category of the product (e.g., fruit, vegetable).'),
});
export type RecommendComplementaryProductsInput = z.infer<typeof RecommendComplementaryProductsInputSchema>;

const RecommendComplementaryProductsOutputSchema = z.object({
  complementaryProducts: z
    .array(z.string())
    .describe('A list of complementary product names that go well with the given product.'),
});
export type RecommendComplementaryProductsOutput = z.infer<typeof RecommendComplementaryProductsOutputSchema>;

export async function recommendComplementaryProducts(
  input: RecommendComplementaryProductsInput
): Promise<RecommendComplementaryProductsOutput> {
  return recommendComplementaryProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendComplementaryProductsPrompt',
  input: {schema: RecommendComplementaryProductsInputSchema},
  output: {schema: RecommendComplementaryProductsOutputSchema},
  prompt: `You are a helpful shopping assistant recommending complementary products.

  Based on the product a user has in their cart, suggest other products that would complement it.
  Return a list of product names.

  Product Name: {{{productName}}}
  Product Category: {{{productCategory}}}
  `,
});

const recommendComplementaryProductsFlow = ai.defineFlow(
  {
    name: 'recommendComplementaryProductsFlow',
    inputSchema: RecommendComplementaryProductsInputSchema,
    outputSchema: RecommendComplementaryProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
