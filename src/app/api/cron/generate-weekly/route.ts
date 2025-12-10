/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { model } from '@/lib/ai/client';

export async function GET() {
    // 1. Fetch events for next weekend (Fri-Sun)
    const supabase = await createClient();

    // Logic to calculate next Friday and Sunday
    const today = new Date();
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + (5 - today.getDay() + 7) % 7);
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);

    const { data: events } = await supabase
        .from('events')
        .select('title, description_summary, start_time, businesses(name)')
        .gte('start_time', nextFriday.toISOString())
        .lte('start_time', nextSunday.toISOString())
        .order('start_time', { ascending: true })
        .limit(20);

    if (!events || events.length === 0) {
        return NextResponse.json({ message: 'No events found for next weekend' });
    }

    // 2. Generate Content with AI
    const prompt = `
You are a local lifestyle editor for Conway, Arkansas.
Based on these events happening next weekend (${nextFriday.toDateString()} - ${nextSunday.toDateString()}), write a "Top 10 Things To Do" listicle.
Focus on variety (Family, Nightlife, Outdoors).
Output Format: JSON { "title": "Top 10...", "content_markdown": "..." }

EVENTS:
${JSON.stringify(events)}
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Sanitize
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const content = JSON.parse(jsonStr);

        // 3. Save to DB
        const { error } = await supabase.from('generated_content').insert({
            title: content.title,
            slug: `weekend-guide-${nextFriday.toISOString().split('T')[0]}`,
            content: content.content_markdown,
            type: 'weekly_guide',
            status: 'draft' // Requires manual review before publish? or auto-publish
        });

        if (error) throw error;

        return NextResponse.json({ success: true, slug: content.title });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
