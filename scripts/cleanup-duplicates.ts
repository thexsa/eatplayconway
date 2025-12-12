
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '@supabase/supabase-js'
// import { levenshtein } from '@/lib/utils/string' // Removed unused import

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Simple Levenshtein implementation
function getEditDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                    Math.min(matrix[i][j - 1] + 1, // insertion
                        matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];
}

async function cleanup() {
    console.log('Fetching events for cleanup...');
    const { data: events, error } = await supabase
        .from('events')
        .select('id, title, start_time, created_at')
        .order('start_time', { ascending: true }); // Group by time roughly

    if (!events) return;

    const duplicatesToDelete: string[] = [];

    // Group by Day (YYYY-MM-DD)
    const dayMap = new Map<string, any[]>();
    events.forEach(e => {
        const day = e.start_time.split('T')[0];
        if (!dayMap.has(day)) dayMap.set(day, []);
        dayMap.get(day)!.push(e);
    });

    dayMap.forEach((group, day) => {
        if (group.length > 1) {
            // Sort by created_at desc (keep newest)
            group.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // Mark items for deletion
            const keptIndices = new Set<number>();

            for (let i = 0; i < group.length; i++) {
                if (duplicatesToDelete.includes(group[i].id)) continue;

                let isDuplicate = false;
                // Compare with already kept items in this group
                // If it's the first item, we keep it (it's the newest)
                // But we must check if it clashes with any *other* kept item?
                // Actually, just compare against *subsequent* items if we iterate?
                // Standard dedup:
                // Keep first (newest). Compare all others to it. matches -> delete.
                // Move to next non-deleted item. Keep it. Compare remaining...

                // Better loop:
                if (keptIndices.has(i)) continue; // Already processed as kept? No.

                // Assume i is a Keeper for now.
                const keeper = group[i];

                for (let j = i + 1; j < group.length; j++) {
                    if (duplicatesToDelete.includes(group[j].id)) continue;

                    const candidate = group[j];

                    // CHECK 1: Same Time (approx)
                    const timeA = new Date(keeper.start_time).getTime();
                    const timeB = new Date(candidate.start_time).getTime();
                    const diffHours = Math.abs(timeA - timeB) / (1000 * 60 * 60);

                    // CHECK 2: Title Similarity
                    const wordsA = keeper.title.toLowerCase().split(' ');
                    const wordsB = candidate.title.toLowerCase().split(' ');
                    const intersection = wordsA.filter((w: string) => wordsB.includes(w));
                    const wordOverlap = intersection.length / Math.min(wordsA.length, wordsB.length);

                    const dist = getEditDistance(keeper.title.toLowerCase(), candidate.title.toLowerCase());
                    const maxLength = Math.max(keeper.title.length, candidate.title.length);
                    const similarity = 1 - (dist / maxLength);

                    // Detect "Hearing" duplicate (AM/PM error often implies 12h diff)
                    const isTimeDuplicate = diffHours < 13 && diffHours > 11; // 12h diff
                    const isExactTime = diffHours < 0.1;

                    if ((similarity > 0.5 || wordOverlap > 0.6) && (isExactTime || isTimeDuplicate)) {
                        console.log(`\nMarking Duplicate (${diffHours.toFixed(1)}h diff):`);
                        console.log(`  KEEP: "${keeper.title}" (${keeper.id}) @ ${keeper.start_time}`);
                        console.log(`  DEL:  "${candidate.title}" (${candidate.id}) @ ${candidate.start_time}`);
                        duplicatesToDelete.push(candidate.id);
                    }
                }
            }
        }
    });

    console.log(`\nFound ${duplicatesToDelete.length} duplicates to delete.`);

    if (duplicatesToDelete.length > 0) {
        // Since we are using Anon key, we might NOT be able to delete if RLS forbids it.
        // But we must try or assume the script will be run by someone with permissions (or I can't do it).
        // Wait, I can only Delete if I own the row? 
        // Or I can use 'ingest.ts' logic which seemed to insert?
        // Deleting requires checking the policy.
        // Policy "Enable Delete for users based on user_id"? 
        // These are owned by system?

        // Try deleting one by one or batch.
        const { error: delError } = await supabase
            .from('events')
            .delete()
            .in('id', duplicatesToDelete);

        if (delError) {
            console.error('Delete failed (likely RLS):', delError);
        } else {
            console.log('Successfully deleted duplicates.');
        }
    }
}

cleanup();
