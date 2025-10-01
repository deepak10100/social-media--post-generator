import type { GenerateSocialMediaPostOutput } from "@/ai/flows/generate-social-media-post";

export type SocialPlatform = 'Instagram' | 'Facebook' | 'Twitter' | 'LinkedIn' | 'Pinterest';
export const socialPlatforms: SocialPlatform[] = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'Pinterest'];

export type PostObjective = 'educate' | 'entertain' | 'promote' | 'inspire' | 'sell';
export const postObjectives: PostObjective[] = ['educate', 'entertain', 'promote', 'inspire', 'sell'];

export type StyleOption = 'Minimalist' | 'Bold' | 'Modern' | 'Elegant' | 'Fun' | 'Creative';
export const styleOptions: StyleOption[] = ['Minimalist', 'Bold', 'Modern', 'Elegant', 'Fun', 'Creative'];

export type GeneratedPost = GenerateSocialMediaPostOutput & {
  id: string;
};

export type GenerationRequest = {
  topic: string;
  platform: SocialPlatform;
  postObjective: PostObjective;
  targetAudience?: string;
  brandColors?: string;
  brandStyle?: string;
  styleOptions?: StyleOption;
};
