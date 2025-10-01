'use server';
/**
 * @fileOverview A flow that suggests engaging captions and relevant, trending hashtags for social media posts.
 *
 * - suggestCaptionAndHashtags - A function that handles the suggestion of captions and hashtags.
 * - SuggestCaptionAndHashtagsInput - The input type for the suggestCaptionAndHashtags function.
 * - SuggestCaptionAndHashtagsOutput - The return type for the suggestCaptionAndHashtags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCaptionAndHashtagsInputSchema = z.object({
  topic: z.string().describe('The topic or niche of the social media post.'),
  postObjective: z
    .string()
    .describe(
      'The objective of the post: educate, entertain, promote, inspire, or sell.'
    ),
  style: z
    .string()
    .optional()
    .describe(
      'The desired style of the caption: minimalist, bold, modern, elegant, fun, or creative.'
    ),
  platform: z
    .string()
    .describe(
      'The social media platform for which the caption and hashtags are intended: Instagram, Facebook, Twitter, LinkedIn, or Pinterest.'
    ),
});
export type SuggestCaptionAndHashtagsInput = z.infer<
  typeof SuggestCaptionAndHashtagsInputSchema
>;

const SuggestCaptionAndHashtagsOutputSchema = z.object({
  caption: z.string().describe('A suggested engaging caption for the post.'),
  hashtags: z
    .array(z.string())
    .describe('An array of relevant and trending hashtags for the post.'),
});
export type SuggestCaptionAndHashtagsOutput = z.infer<
  typeof SuggestCaptionAndHashtagsOutputSchema
>;

export async function suggestCaptionAndHashtags(
  input: SuggestCaptionAndHashtagsInput
): Promise<SuggestCaptionAndHashtagsOutput> {
  return suggestCaptionAndHashtagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCaptionAndHashtagsPrompt',
  input: {schema: SuggestCaptionAndHashtagsInputSchema},
  output: {schema: SuggestCaptionAndHashtagsOutputSchema},
  prompt: `You are a social media expert. You will generate a caption and hashtags for a social media post.

  Topic: {{{topic}}}
  Post Objective: {{{postObjective}}}
  Style: {{{style}}}
  Platform: {{{platform}}}

  Caption: A catchy caption that is appropriate for the specified platform.
  Hashtags: A list of relevant and trending hashtags for the specified platform.

  Return the caption and hashtags in JSON format.
  {
    "caption": "Your catchy caption with emojis",
    "hashtags": ["#hashtag1", "#hashtag2", ...]
  }`,
});

const suggestCaptionAndHashtagsFlow = ai.defineFlow(
  {
    name: 'suggestCaptionAndHashtagsFlow',
    inputSchema: SuggestCaptionAndHashtagsInputSchema,
    outputSchema: SuggestCaptionAndHashtagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
