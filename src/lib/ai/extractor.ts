import { model } from './client';
import { NormalizedEvent } from '../scraper/types';

interface ExtractionResult {
    events: NormalizedEvent[];
}

// Update signature to accept metadata
export async function extractEventsFromText(
    text: string,
    sourceUrl: string,
    metadata?: { candidate_images?: string[] }
): Promise<NormalizedEvent[]> {
    const candidateImagesList = metadata?.candidate_images?.slice(0, 10).map(url => `- ${url}`).join('\n') || 'None';

    const prompt = `
    You are an expert event data extractor.
    Your goal is to extract event information from the provided text, which was scraped from a website.
    The source URL is: ${sourceUrl}

    CANDIDATE IMAGES (found in page metadata):
    ${candidateImagesList}

    Please extract a list of events. For each event, provide:
    - title: The name of the event.
    - start_time: The start date and time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ). Assume the event is in the near future (2025) if the year is missing. Use the Central Time Zone (America/Chicago) context if needed.
    - description: A brief summary of the event details, including price if mentioned.
    - url: A specific URL for the event if available in the text, otherwise use the source URL.
    - image_url: A relevant image URL. Preference order:
        1. An image explicitly linked next to the event in the text.
        2. One of the 'CANDIDATE IMAGES' if it looks like a main event flyer or relevant photo.
        3. Null if no good match.
    - raw_data: Store any other relevant raw details here as a JSON object (e.g. location, price string).
    
    IMPORTANT: Do NOT extract the following types of content:
    - Obituaries, death notices, or funeral announcements.
    - Police logs, arrest reports, or court dockets.
    - Classified ads or generic business listings (unless it's a specific event).

    If the text contains no events, return an empty list.
    
    Input Text:
    """
    ${text.slice(0, 30000)} 
    """
    
    Output Format (JSON):
    {
        "events": [
            {
                "title": "String",
                "start_time": "ISO Date String",
                "description": "String",
                "url": "String",
                "image_url": "String | null",
                "raw_data": {} 
            }
        ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text) as ExtractionResult;
        return data.events || [];
    } catch (error) {
        console.error('AI Extraction Failed:', error);
        return [];
    }
}
