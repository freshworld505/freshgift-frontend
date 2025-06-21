'use server';
/**
 * @fileOverview A general Q&A AI flow for produce-related questions.
 *
 * - answerProduceQuestion - A function that answers user questions about produce.
 * - ProduceQnaInput - The input type for the answerProduceQuestion function.
 * - ProduceQnaOutput - The return type for the answerProduceQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProduceQnaInputSchema = z.object({
  userQuery: z.string().describe('The user\'s question about fruits or vegetables.'),
});
export type ProduceQnaInput = z.infer<typeof ProduceQnaInputSchema>;

const ProduceQnaOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type ProduceQnaOutput = z.infer<typeof ProduceQnaOutputSchema>;

export async function answerProduceQuestion(input: ProduceQnaInput): Promise<ProduceQnaOutput> {
  return produceQnaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'produceQnaPrompt',
  input: {schema: ProduceQnaInputSchema},
  output: {schema: ProduceQnaOutputSchema},
  prompt: `You are "VeggieBot", a friendly and knowledgeable AI assistant for FreshGift, an online grocery store specializing in fresh fruits and vegetables.
Your goal is to answer customer questions about our produce. This includes information about specific fruits or vegetables (e.g., "Tell me about avocados", "What's the difference between kale and spinach?"), seasonality, simple preparation ideas ("How can I prepare parsnips?"), and what might pair well with certain items for a meal.
Keep your answers concise, helpful, and focused on food.
If a question is outside the scope of fruits, vegetables, or simple food pairings/preparation, politely state that you specialize in produce and can't answer that specific query, but you're happy to help with any fruit or vegetable questions.

User's question: {{{userQuery}}}
Answer:
`,
});

const produceQnaFlow = ai.defineFlow(
  {
    name: 'produceQnaFlow',
    inputSchema: ProduceQnaInputSchema,
    outputSchema: ProduceQnaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
