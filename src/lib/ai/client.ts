import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.warn('GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(apiKey || '');
// Restore to 1.5 Pro as desired. 
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Using 1.5 Flash for speed/cost efficiency, can upgrade to Pro later
