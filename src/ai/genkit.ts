import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Prefer GEMINI_API_KEY, fall back to GOOGLE_API_KEY for compatibility.
const API_KEY = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY ?? '';

// Initialize GenKit with the Google GenAI plugin using the API key from env.
// Note: Vercel must have GEMINI_API_KEY or GOOGLE_API_KEY set in Project Settings -> Environment Variables.
if (!API_KEY && process.env.NODE_ENV === 'production') {
  throw new Error(
    'GenKit initialization failed: GEMINI_API_KEY or GOOGLE_API_KEY environment variable is not set.\n' +
      'Add it in your Vercel Project Settings -> Environment Variables and redeploy. See: https://genkit.dev/docs/plugins/google-genai/'
  );
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: API_KEY })],
  model: 'googleai/gemini-2.5-flash',
});
