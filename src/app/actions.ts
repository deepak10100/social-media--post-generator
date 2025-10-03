
'use server';

import { generateSocialMediaPost } from '@/ai/flows/generate-social-media-post';
import type { GenerateSocialMediaPostOutput } from '@/ai/flows/generate-social-media-post';
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
        const TIMEOUT_MS = 30_000; // 30 seconds per AI request

        const callWithTimeout = async <T>(p: Promise<T>, ms: number) => {
            return new Promise<T>((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('AI generation timed out')), ms);
                p.then((v) => {
                    clearTimeout(timer);
                    resolve(v);
                }).catch((err) => {
                    clearTimeout(timer);
                    reject(err);
                });
            });
        };

        const generationPromises = Array(3)
            .fill(null)
            .map(() => callWithTimeout(generateSocialMediaPost(request), TIMEOUT_MS));

        const settled = await Promise.allSettled(generationPromises);

        // Log raw AI outputs and promise statuses for debugging (visible in Vercel logs)
        console.info('AI generation settled results:', JSON.stringify(settled, null, 2));

        const successful = settled
            .filter((s) => s.status === 'fulfilled')
            .map((s) => (s as PromiseFulfilledResult<any>).value as unknown as GenerateSocialMediaPostOutput);

        if (successful.length === 0) {
            const reasons = settled
                .filter((s) => s.status === 'rejected')
                .map((s) => (s as PromiseRejectedResult).reason?.toString?.() ?? String((s as PromiseRejectedResult).reason));
            console.error('All AI generation calls failed:', reasons);
            return { success: false, error: 'AI generation failed or timed out. Check logs for details.' };
        }

        const posts: GeneratedPost[] = successful.map((post) => {
            const seed = Math.floor(Math.random() * 1000);

            // Be defensive: handle missing or malformed dimensions from AI output.
            let width = 1080;
            let height = 1080;
            try {
                if (post.dimensions && typeof post.dimensions === 'string') {
                    const parts = post.dimensions.split('x').map((d: string) => parseInt(d.trim(), 10));
                    if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
                        width = parts[0];
                        height = parts[1];
                    }
                }
            } catch (err) {
                // ignore and fallback to defaults
                console.warn('Failed to parse dimensions from AI output:', post.dimensions, err);
            }

            return {
                ...post,
                id: crypto.randomUUID(),
                postImage: `https://picsum.photos/seed/${seed}/${width}/${height}`,
            };
        });

        return { success: true, posts };
    } catch (e) {
        console.error('Unexpected error in generatePostsAction:', e);
        return { success: false, error: 'An unexpected error occurred while generating posts. Please try again.' };
    }
}
