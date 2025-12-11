'use server'

import { processSource } from '@/lib/scraper/orchestrator'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Invalid URL'),
    type: z.enum(['rss', 'html', 'json']),
    frequency: z.coerce.number().min(1, 'Minimum frequency is 1 hour'),
})

export async function addSource(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const validatedFields = schema.safeParse({
        name: formData.get('name'),
        url: formData.get('url'),
        type: formData.get('type'),
        frequency: formData.get('frequency'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Source.',
        }
    }

    const { name, url, type, frequency } = validatedFields.data

    try {
        const { error } = await supabase.from('scrape_sources').insert({
            name,
            source_url: url,
            source_type: type,
            frequency_hours: frequency,
            is_active: true,
        })

        if (error) throw error
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Source.',
        }
    }

    revalidatePath('/admin/sources')
    redirect('/admin/sources')
}

export async function runSource(id: string) {
    try {
        await processSource(id)
        revalidatePath('/admin/sources')
        return { message: 'Scraper triggered successfully' }
    } catch (e) {
        console.error(e)
        return { message: 'Failed to run scraper' }
    }
}

export async function toggleSource(id: string, currentState: boolean) {
    const supabase = await createClient()

    try {
        await supabase
            .from('scrape_sources')
            .update({ is_active: !currentState })
            .eq('id', id)

        revalidatePath('/admin/sources')
        return { message: 'Updated source status' }
    } catch (e) {
        return { message: 'Failed to update source' }
    }
}

export async function deleteSource(id: string) {
    const supabase = await createClient()

    try {
        await supabase
            .from('scrape_sources')
            .delete()
            .eq('id', id)

        revalidatePath('/admin/sources')
        return { message: 'Deleted source' }
    } catch (e) {
        return { message: 'Failed to delete source' }
    }
}
