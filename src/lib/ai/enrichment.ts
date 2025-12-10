/* eslint-disable @typescript-eslint/no-explicit-any */
import { model } from './client';
import { ENRICHMENT_PROMPT } from './prompts';

export interface EnrichedData {
    title: string;
    description_summary: string;
    categories: string[];
    price_min?: number;
    price_max?: number;
    is_family_friendly: boolean;
    confidence_score: number;
}

export async function enrichEvent(rawEvent: any): Promise<EnrichedData> {
    try {
        const prompt = `${ENRICHMENT_PROMPT}\n\nRAW EVENT DATA:\n${JSON.stringify(rawEvent, null, 2)}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Sanitize code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonStr) as EnrichedData;
    } catch (error) {
        console.error('AI Enrichment Failed', error);
        // Fallback
        return {
            title: rawEvent.title,
            description_summary: rawEvent.description || 'No summary available.',
            categories: ['Other'],
            is_family_friendly: true,
            confidence_score: 0.0
        };
    }
}
