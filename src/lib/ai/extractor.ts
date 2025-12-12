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
    - start_time: The start date and time in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ). Assume the event is in the near future (2025/2026) if the year is missing. Use the Central Time Zone (America/Chicago) context if needed.
    - location: The venue name or address where the event takes place (e.g. "Simon Park", "UCA Reynolds Performance Hall").
    - description: A brief summary of the event details, including price if mentioned and the original link to the specific event details if found.
    - url: A specific URL for the event details if available in the text. If not, use the source URL.
    - image_url: A relevant image URL. Preference order:
        1. An image explicitly linked next to the event in the text.
        2. One of the 'CANDIDATE IMAGES' if it looks like a main event flyer or relevant photo.
        3. Null if no good match.
    - raw_data: Store any other relevant raw details here as a JSON object (e.g. price string, ticket_url).
    
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
                "location": "String",
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

// Interface for Deals extraction result
interface DealExtractionResult {
    deals: NormalizedDeal[];
}
import { NormalizedDeal } from '../scraper/types';

export async function extractDealsFromText(
    text: string,
    sourceUrl: string
): Promise<NormalizedDeal[]> {
    const prompt = `
    You are an expert data extractor specializing in restaurant specials and deals.
    Your goal is to extract "Daily Specials", "Happy Hours", "Lunch Specials", or recurring deals from the provided text.
    The source URL is: ${sourceUrl}

    Please extract a list of deals/specials. For each deal, provide:
    - title: The name of the deal (e.g. "Taco Tuesday", "Happy Hour", "$10 Burger").
    - description: Details of what is included.
    - deal_type: One of ['happy_hour', 'discount', 'bogo', 'special']. Use 'special' for general daily specials.
    - active_days: Array of days this deal is active (e.g. ["Tuesday"], ["Monday", "Friday"], ["Every Day"]). If purely "Weekend", list ["Saturday", "Sunday"].
    - valid_from: Start time (HH:mm) if specified (e.g. "16:00").
    - valid_until: End time (HH:mm) if specified (e.g. "19:00").
    - price: Price string if mentioned (e.g. "$5.00").

    IMPORTANT:
    - Ignore one-time events (concerts, trivia nights) unless they have a specific food/drink special attached.
    - Ignore general menu items unless they are explicitly marked as a "Special" or "Deal".

    If the text contains no deals, return an empty list.

    Input Text:
    """
    ${text.slice(0, 20000)}
    """

    Output Format (JSON):
    {
        "deals": [
            {
                "title": "String",
                "description": "String",
                "deal_type": "happy_hour | discount | bogo | special",
                "active_days": ["String"],
                "valid_from": "HH:mm | null",
                "valid_until": "HH:mm | null",
                "price": "String | null"
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

        const data = JSON.parse(text) as DealExtractionResult;
        return data.deals || [];
    } catch (error) {
        console.error('AI Deal Extraction Failed:', error);
        return [];
    }
}
