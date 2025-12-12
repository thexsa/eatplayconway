
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function enforceRetention() {
    console.log('Enforcing Retention Policy...');

    // 1. News: Delete older than 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    console.log(`News Cutoff: ${thirtyDaysAgo.toISOString()}`);

    // Query News to Delete
    // Note: 'categories' is jsonb.
    const { data: oldNews, error: newsError } = await supabase
        .from('events')
        .select('id, title, start_time')
        .contains('categories', ['News'])
        .lt('start_time', thirtyDaysAgo.toISOString());

    if (newsError) {
        console.error('Error fetching old news:', newsError);
    } else if (oldNews && oldNews.length > 0) {
        console.log(`Found ${oldNews.length} expired news items.`);
        const ids = oldNews.map(e => e.id);

        // Batch delete
        const { error: delError } = await supabase
            .from('events')
            .delete()
            .in('id', ids);

        if (delError) {
            console.error('Failed to delete old news:', delError);
        } else {
            console.log(`Successfully deleted ${oldNews.length} old news items.`);
            oldNews.forEach(e => console.log(` - Deleted: "${e.title}" (${e.start_time})`));
        }
    } else {
        console.log('No expired news items found.');
    }

    // 2. Events: Delete older than 6 months
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    console.log(`Events Cutoff: ${sixMonthsAgo.toISOString()}`);

    // Query Events to Delete (exclude News to be safe, though retention is looser so it wouldn't hurt)
    // Actually, if it's News, it's already handled above (stricter). 
    // If it's NOT News, check 6 months.
    // However, `not.contains('categories', ['News'])` might be tricky with jsonb.
    // Instead, just query everything older than 6 months. 
    // Anything older than 6 months is definitely older than 30 days.
    // So if I just delete EVERYTHING older than 6 months first?
    // No, News is 30 days. So News older than 6 months is also deleted by "News Rule".
    // I need to find Non-News older than 6 months.

    // But supabase filter for "not contains" is hard?
    // Let's just fetch all older than 6 months, filtering locally if needed, or deleting all?
    // Retention says "Events from last 6 months".
    // Does that mean "Keep events from last 6 months"?
    // Yes. So anything older than 6 months is garbage.
    // Regardless of category?
    // News older than 30 days is garbage.
    // Events older than 6 months is garbage.
    // So "Older than 6 months" implies "Older than 30 days" (true).
    // So EVERYTHING older than 6 months should be deleted.

    const { data: oldEvents, error: eventsError } = await supabase
        .from('events')
        .select('id, title, start_time, categories')
        .lt('start_time', sixMonthsAgo.toISOString());

    if (eventsError) {
        console.error('Error fetching old events:', eventsError);
    } else if (oldEvents && oldEvents.length > 0) {
        console.log(`Found ${oldEvents.length} items older than 6 months.`);
        const ids = oldEvents.map(e => e.id);

        const { error: delError } = await supabase
            .from('events')
            .delete()
            .in('id', ids);

        if (delError) {
            console.error('Failed to delete old events:', delError);
        } else {
            console.log(`Successfully deleted ${oldEvents.length} very old items.`);
        }
    } else {
        console.log('No items older than 6 months found.');
    }
}

enforceRetention();
