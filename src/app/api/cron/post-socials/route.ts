/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { model } from '@/lib/ai/client';

export async function GET() {
    const supabase = await createClient();

    // 1. Get today's top events
    const today = new Date().toISOString().split('T')[0];
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', today)
        .lt('start_time', new Date(Date.now() + 86400000).toISOString())
        .order('ai_confidence', { ascending: false })
        .limit(3);

    if (!events?.length) return NextResponse.json({ skipped: true });

    // 2. Generate Social Copy
    const prompt = `
Write a catchy Facebook/Instagram caption for "What's happening in Conway today".
Highlight these 3 events:
${events.map(e => `- ${e.title} at ${e.start_time}`).join('\n')}

Keep it under 280 chars for Twitter, but longer for FB is fine. Return JSON: { "facebook": "...", "twitter": "..." }
`;

    // 3. Mock Post (Real implementation would use FB Graph API)
    // For MVP, we likely just log it or save to a 'social_queue' table
    return NextResponse.json({ active: true, events_count: events.length });
}
