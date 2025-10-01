'use server';

/**
 * @fileOverview A social media post generator AI agent.
 *
 * - generateSocialMediaPost - A function that generates a social media post.
 * - GenerateSocialMediaPostInput - The input type for the generateSocialMediaPost function.
 * - GenerateSocialMediaPostOutput - The return type for the generateSocialMediaPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSocialMediaPostInputSchema = z.object({
  topic: z.string().describe('The topic of the social media post.'),
  platform: z.enum([
    'Instagram',
    'Facebook',
    'Twitter',
    'LinkedIn',
    'Pinterest',
  ]).describe('The social media platform for the post.'),
  postObjective: z.enum(['educate', 'entertain', 'promote', 'inspire', 'sell']).describe('The objective of the post.'),
  targetAudience: z.string().optional().describe('The target audience for the post.'),
  brandColors: z.string().optional().describe('The brand colors to use in the post.'),
  brandStyle: z.string().optional().describe('The brand style to use in the post.'),
  styleOptions: z.enum(['Minimalist', 'Bold', 'Modern', 'Elegant', 'Fun', 'Creative']).optional().describe('The style of the post.'),
});
export type GenerateSocialMediaPostInput = z.infer<typeof GenerateSocialMediaPostInputSchema>;

const GenerateSocialMediaPostOutputSchema = z.object({
  platform: z.string().describe('The social media platform for the post.'),
  postImage: z.string().describe('The URL or description of the generated post image.'),
  caption: z.string().describe('The generated caption for the post, including emojis.'),
  hashtags: z.array(z.string()).describe('The generated hashtags for the post.'),
  cta: z.string().optional().describe('The call to action text for the post.'),
  dimensions: z.string().describe('The suggested image dimensions for the post.'),
});
export type GenerateSocialMediaPostOutput = z.infer<typeof GenerateSocialMediaPostOutputSchema>;

export async function generateSocialMediaPost(input: GenerateSocialMediaPostInput): Promise<GenerateSocialMediaPostOutput> {
  return generateSocialMediaPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSocialMediaPostPrompt',
  input: {schema: GenerateSocialMediaPostInputSchema},
  output: {schema: GenerateSocialMediaPostOutputSchema},
  prompt: `You are an expert social media manager. Your job is to create engaging social media posts.

  Based on the following information, generate a social media post for the specified platform.

  Topic: {{{topic}}}
  Platform: {{{platform}}}
  Post Objective: {{{postObjective}}}
  Target Audience: {{{targetAudience}}}
  Brand Colors: {{{brandColors}}}
  Brand Style: {{{brandStyle}}}
  Style Options: {{{styleOptions}}}

  Output the response in a JSON format:
  {
    "platform": "{{platform}}",
    "postImage": "image_url_or_description",
    "caption": "Your catchy caption with emojis",
    "hashtags": ["#hashtag1","#hashtag2"],
    "cta": "Call to action text",
    "dimensions": "widthxheight"
  }
  `,
});

const generateSocialMediaPostFlow = ai.defineFlow(
  {
    name: 'generateSocialMediaPostFlow',
    inputSchema: GenerateSocialMediaPostInputSchema,
    outputSchema: GenerateSocialMediaPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
