'use server'

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveBusiness(id: string) {
    const supabase = await createClient();

    // Check if user is admin first? Using RLS usually, but here we just run it.

    await supabase.from('businesses')
        .update({ is_verified: true })
        .eq('id', id);

    revalidatePath('/admin/businesses');
    revalidatePath('/admin/dashboard'); // Might show stats
}

export async function rejectBusiness(id: string) {
    const supabase = await createClient();

    // For now, rejection = deletion
    await supabase.from('businesses')
        .delete()
        .eq('id', id);

    revalidatePath('/admin/businesses');
}
