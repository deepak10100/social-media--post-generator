'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface CopyButtonProps extends ButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy, className, ...props }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
        setHasCopied(true);
        toast({
            description: "Copied to clipboard!",
        });
        setTimeout(() => {
          setHasCopied(false);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
            variant: 'destructive',
            title: 'Copy Failed',
            description: 'Could not copy text to clipboard.',
        });
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('h-7 w-7 text-muted-foreground hover:text-foreground', className)}
      onClick={onCopy}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
