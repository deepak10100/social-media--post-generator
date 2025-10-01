
'use server';

import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import type { GeneratedPost, GenerationRequest } from '@/lib/types';
import { z } from 'zod';

const generationRequestSchema = z.object({
    topic: z.string().min(1, 'Topic is required.'),
    platform: z.enum(['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'Pinterest']),
    postObjective: z.enum(['educate', 'entertain', 'promote', 'inspire', 'sell']),
    targetAudience: z.string().optional(),
    brandColors: z.string().optional(),
    brandStyle: z.string().optional(),
    styleOptions: z.enum(['Minimalist', 'Bold', 'Modern', 'Elegant', 'Fun', 'Creative']).optional(),
});


export async function generatePostsAction(request: GenerationRequest): Promise<{ success: boolean; posts?: GeneratedPost[]; error?: string }> {
    const validation = generationRequestSchema.safeParse(request);
    if (!validation.success) {
        const errorMessage = validation.error.errors.map(e => e.message).join(', ');
        return { success: false, error: errorMessage };
    }
    
    try {
        const generationPromises = Array(3).fill(null).map(() => generateSocialMediaPost(request));
        const results = await Promise.all(generationPromises);

        const posts: GeneratedPost[] = results.map((post) => {
            const seed = Math.floor(Math.random() * 1000);
            
            const [width, height] = post.dimensions.split('x').map(d => parseInt(d, 10));

            return {
                ...post,
                id: crypto.randomUUID(),
                postImage: `https://picsum.photos/seed/${seed}/${width || 1080}/${height || 1080}`,
            };
        });

        return { success: true, posts };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'An unexpected error occurred while generating posts. Please try again.' };
    }
}
