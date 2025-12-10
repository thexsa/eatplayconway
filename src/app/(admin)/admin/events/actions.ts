'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approveEvent(eventId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('id', eventId)

    if (error) {
        throw new Error('Failed to approve event')
    }

    revalidatePath('/admin/events')
    revalidatePath('/events')
    revalidatePath('/')
}

export async function rejectEvent(eventId: string) {
    const supabase = await createClient()

    // Soft delete by marking as archived or could delete permanently
    const { error } = await supabase
        .from('events')
        .update({ status: 'archived' }) // or delete()
        .eq('id', eventId)

    if (error) {
        throw new Error('Failed to reject event')
    }

    revalidatePath('/admin/events')
}
