
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function fixRLS() {
    console.log('--- ENABLING READ ACCESS FOR EAT SECTION ---');

    // We can't execute raw SQL via client directly unless we have an RPC for it, 
    // or we use the specific PG connection (which we don't have).
    // HOWEVER, we can check if we can read.

    // If we can't write SQL, we might be stuck unless the user runs it in dashboard.
    // BUT common RLS setup often allows anon read if we enable it on table? 
    // No, we can't change policies via JS client typically.

    // Wait, let's verify if 'anon' can read.
    const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await anonClient.from('businesses').select('count');
    if (error) {
        console.error('Anon Read Check Failed:', error);
        console.log('\n!!! IMPORTANT !!!');
        console.log('You must run the following SQL in your Supabase Dashboard SQL Editor:');
        console.log(`
            alter table businesses enable row level security;
            create policy "Public businesses are viewable by everyone"
            on businesses for select
            to anon, authenticated
            using ( true );

            alter table deals enable row level security;
            create policy "Public deals are viewable by everyone"
            on deals for select
            to anon, authenticated
            using ( true );
        `);
    } else {
        console.log('Anon Read Check Passed! businesses count:', data);
    }
}

fixRLS();
