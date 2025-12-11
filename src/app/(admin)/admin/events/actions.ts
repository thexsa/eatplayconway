'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

export async function approveAllPending() {
    const supabase = await createClient()

    const { error } = await supabase
        .from('events')
        .update({ status: 'published' })
        .eq('status', 'draft') // or 'pending' if you use that status, assuming 'draft' is the review state

    if (error) {
        throw new Error('Failed to bulk approve events')
    }

    revalidatePath('/admin/events')
    revalidatePath('/events')
    revalidatePath('/')
}

export async function updateEvent(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const startTime = formData.get('start_time') as string
    const endTime = formData.get('end_time') as string
    const imageUrl = formData.get('image_url') as string

    // Basic validation
    if (!id || !title || !startTime) {
        return { message: 'Missing required fields' }
    }

    try {
        const { error } = await supabase
            .from('events')
            .update({
                title,
                description_raw: description,
                start_time: new Date(startTime).toISOString(),
                end_time: endTime ? new Date(endTime).toISOString() : null,
                image_url: imageUrl || null
            })
            .eq('id', id)

        if (error) throw error
    } catch (e) {
        return { message: 'Database Error: Failed to Update Event.' }
    }

    revalidatePath('/admin/events')
    revalidatePath(`/events`)
    redirect('/admin/events')
}
