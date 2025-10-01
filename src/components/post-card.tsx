'use client';
import Image from 'next/image';
import { Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import type { GeneratedPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CopyButton } from './copy-button';

type PostCardProps = {
  post: GeneratedPost;
};

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.084-.6-.16-1.582.022-2.204.183-.623 1.12-4.744 1.12-4.744s-.29-.58-.29-1.442c0-1.35.783-2.364 1.75-2.364.825 0 1.22.62 1.22 1.353 0 .82-.525 2.046-.796 3.187-.223.94.47 1.705 1.406 1.705 1.68 0 2.97-1.77 2.97-4.325 0-2.28-1.604-3.873-3.95-3.873-2.657 0-4.185 1.98-4.185 4.028 0 .762.28 1.58.63 2.062.087.12.096.17.07.265-.02.08-.066.26-.09.352-.03.11-.08.136-.21.08-1.04-.49-1.68-1.92-1.68-3.23 0-2.58 1.9-4.87 5.29-4.87 2.82 0 4.97 2.022 4.97 4.54 0 2.76-1.74 4.94-4.16 4.94-1.38 0-2.68-.72-3.12-1.57l-.74 2.84c-.28 1.05-.79 2.19-1.18 2.87.57.1.92.15 1.47.15 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );

const platformIcons = {
  Instagram: <Instagram className="h-5 w-5" />,
  Facebook: <Facebook className="h-5 w-5" />,
  Twitter: <Twitter className="h-5 w-5" />,
  LinkedIn: <Linkedin className="h-5 w-5" />,
  Pinterest: <PinterestIcon className="h-5 w-5" />,
};

export function PostCard({ post }: PostCardProps) {
  const hashtagsString = post.hashtags.join(' ');
  
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-secondary/50 p-4">
        <div className="flex items-center gap-2">
            {platformIcons[post.platform as keyof typeof platformIcons]}
            <CardTitle className="text-lg font-semibold">{post.platform}</CardTitle>
        </div>
        <Badge variant="outline">{post.dimensions}</Badge>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 space-y-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border">
          <Image
            src={post.postImage}
            alt="Generated post image"
            fill
            className="object-cover"
            data-ai-hint="social media post"
          />
        </div>

        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Suggested Caption</h3>
                <CopyButton textToCopy={post.caption} />
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.caption}</p>
        </div>
        
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Hashtags</h3>
                <CopyButton textToCopy={hashtagsString} />
            </div>
            <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                {tag}
                </Badge>
            ))}
            </div>
        </div>

      </CardContent>
      
      {post.cta && (
        <>
            <Separator />
            <CardFooter className="p-4 bg-secondary/50">
                <div className="w-full">
                    <h3 className="font-semibold mb-2">Call to Action</h3>
                    <p className="text-sm text-muted-foreground italic">"{post.cta}"</p>
                </div>
            </CardFooter>
        </>
      )}
    </Card>
  );
}
