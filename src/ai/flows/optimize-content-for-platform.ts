'use server';

/**
 * @fileOverview A flow that optimizes social media content (image dimensions, caption length) for a specific platform.
 *
 * - optimizeContentForPlatform - A function that optimizes the content for a given platform.
 * - OptimizeContentInput - The input type for the optimizeContentForPlatform function.
 * - OptimizeContentOutput - The return type for the optimizeContentForPlatform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PlatformEnum = z.enum(['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'Pinterest']);

const OptimizeContentInputSchema = z.object({
  platform: PlatformEnum.describe('The social media platform to optimize for.'),
  postImage: z.string().describe('The URL or data URI of the post image.'),
  caption: z.string().describe('The original caption for the post.'),
  hashtags: z.array(z.string()).describe('An array of hashtags for the post.'),
  cta: z.string().optional().describe('The call to action text for the post.'),
});
export type OptimizeContentInput = z.infer<typeof OptimizeContentInputSchema>;

const OptimizeContentOutputSchema = z.object({
  optimizedCaption: z.string().describe('The optimized caption for the platform.'),
  optimizedHashtags: z.array(z.string()).describe('The optimized hashtags for the platform.'),
  suggestedDimensions: z.string().describe('The suggested image dimensions for the platform (e.g., 1080x1080).'),
});
export type OptimizeContentOutput = z.infer<typeof OptimizeContentOutputSchema>;

export async function optimizeContentForPlatform(input: OptimizeContentInput): Promise<OptimizeContentOutput> {
  return optimizeContentForPlatformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeContentPrompt',
  input: {schema: OptimizeContentInputSchema},
  output: {schema: OptimizeContentOutputSchema},
  prompt: `You are an expert social media manager. Optimize the provided social media post content for the specified platform.

Platform: {{{platform}}}
Original Caption: {{{caption}}}
Original Hashtags: {{#each hashtags}}{{{this}}} {{/each}}

Consider the platform's character limits, audience, and best practices when optimizing the caption and hashtags.  Also suggest image dimensions for the platform.

Output the optimized caption, optimized hashtags, and suggested image dimensions in JSON format.

If a CTA (Call To Action) was provided, make sure the caption is optimized for it.

Here's the CTA text: {{{cta}}}
`,
});

const optimizeContentForPlatformFlow = ai.defineFlow(
  {
    name: 'optimizeContentForPlatformFlow',
    inputSchema: OptimizeContentInputSchema,
    outputSchema: OptimizeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
