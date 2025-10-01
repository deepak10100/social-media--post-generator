'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { socialPlatforms, postObjectives, styleOptions, type GenerationRequest } from '@/lib/types';

const formSchema = z.object({
  topic: z.string().min(10, {
    message: 'Topic must be at least 10 characters.',
  }),
  platform: z.enum(socialPlatforms),
  postObjective: z.enum(postObjectives),
  targetAudience: z.string().optional(),
  brandColors: z.string().optional(),
  brandStyle: z.string().optional(),
  styleOptions: z.enum(styleOptions).optional(),
});

type PostGeneratorFormProps = {
  onGenerate: (data: GenerationRequest) => void;
  isLoading: boolean;
};

export function PostGeneratorForm({ onGenerate, isLoading }: PostGeneratorFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      platform: 'Instagram',
      postObjective: 'educate',
      targetAudience: '',
      brandColors: '',
      brandStyle: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onGenerate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Topic / Niche / Keywords</FormLabel>
                <FormControl>
                    <Textarea
                    placeholder="e.g., 'The benefits of sustainable fashion' or 'Easy 15-minute vegan recipes'"
                    {...field}
                    rows={3}
                    />
                </FormControl>
                <FormDescription>
                    Provide the core idea for your social media post.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {socialPlatforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                        {platform}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="postObjective"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Post Objective</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an objective" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {postObjectives.map((objective) => (
                        <SelectItem key={objective} value={objective}>
                        {objective.charAt(0).toUpperCase() + objective.slice(1)}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Optional Settings</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Young professionals aged 25-35'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Colors</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., '#29ABE2, #FF9800'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'Playful and vibrant'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="styleOptions"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Visual Style</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a visual style" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {styleOptions.map((style) => (
                            <SelectItem key={style} value={style}>
                            {style}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button type="submit" disabled={isLoading} className="w-full" variant="default" size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Generate Posts
        </Button>
      </form>
    </Form>
  );
}
