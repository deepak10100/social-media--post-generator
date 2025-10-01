'use server';

/**
 * @fileOverview A flow for generating high-quality images for social media posts based on a topic and style.
 *
 * - generatePostImage - A function that handles the image generation process.
 * - GeneratePostImageInput - The input type for the generatePostImage function.
 * - GeneratePostImageOutput - The return type for the generatePostImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePostImageInputSchema = z.object({
  topic: z.string().describe('The topic or subject of the social media post.'),
  style: z.string().describe('The desired style of the image (e.g., minimalist, bold, modern).'),
  brandColors: z.string().optional().describe('Optional brand colors to incorporate into the image.'),
  textOverlay: z.string().optional().describe('Optional text to overlay on the image.'),
});
export type GeneratePostImageInput = z.infer<typeof GeneratePostImageInputSchema>;

const GeneratePostImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GeneratePostImageOutput = z.infer<typeof GeneratePostImageOutputSchema>;

export async function generatePostImage(input: GeneratePostImageInput): Promise<GeneratePostImageOutput> {
  return generatePostImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePostImagePrompt',
  input: {schema: GeneratePostImageInputSchema},
  output: {schema: GeneratePostImageOutputSchema},
  prompt: `Generate a high-quality image for a social media post with the following specifications:\n\nTopic: {{{topic}}}\nStyle: {{{style}}}\nBrand Colors: {{{brandColors}}}\nText Overlay: {{{textOverlay}}}\n\nCreate a visually appealing image that is suitable for social media.\nInclude the brand colors if provided.\nInclude the text overlay if provided.\nMake sure it is professional looking, aesthetic, and realistic.`,
});

const generatePostImageFlow = ai.defineFlow(
  {
    name: 'generatePostImageFlow',
    inputSchema: GeneratePostImageInputSchema,
    outputSchema: GeneratePostImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Topic: ${input.topic}, Style: ${input.style}, Brand Colors: ${input.brandColors ?? 'none'}, Text Overlay: ${input.textOverlay ?? 'none'}. Create realistic, aesthetic, professional social media image.`,
    });

    return {imageUrl: media.url};
  }
);
