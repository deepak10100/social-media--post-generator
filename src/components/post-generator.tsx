'use client';
import { useState } from 'react';
import { PostGeneratorForm } from '@/components/post-generator-form';
import { PostResultsView } from '@/components/post-results-view';
import { useToast } from '@/hooks/use-toast';
import { generatePostsAction } from '@/app/actions';
import type { GeneratedPost, GenerationRequest } from '@/lib/types';

export function PostGenerator() {
    const [posts, setPosts] = useState<GeneratedPost[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async (data: GenerationRequest) => {
        setIsLoading(true);
        setPosts([]);
        const result = await generatePostsAction(data);
        if (result.success && result.posts) {
            setPosts(result.posts);
        } else {
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: result.error || 'An unknown error occurred.',
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="grid flex-1 md:grid-cols-[380px_1fr] lg:grid-cols-[420px_1fr]">
            <aside className="border-r bg-background p-4 lg:p-6">
                <div className="sticky top-20">
                    <PostGeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                </div>
            </aside>
            <main className="p-4 lg:p-6">
                <PostResultsView posts={posts} isLoading={isLoading} />
            </main>
        </div>
    );
}
