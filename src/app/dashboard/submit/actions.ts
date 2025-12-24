'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { slugify } from '@/utils/slugify'

export async function submitEvent(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!business) throw new Error('No business found')

    const title = formData.get('title') as string
    const start_time = formData.get('start_time') as string
    const description = formData.get('description') as string
    const image_url = formData.get('image_url') as string
    const categories = (formData.get('categories') as string)?.split(',').map(c => c.trim())

    const { error } = await supabase
        .from('events')
        .insert({
            business_id: business.id,
            title,
            slug: slugify(title) + '-' + Math.random().toString(36).slice(-4),
            start_time: new Date(start_time).toISOString(),
            description_raw: description,
            description_summary: description.slice(0, 150),
            image_url,
            categories: categories || ['Event'],
            status: 'draft' // Requires admin approval
        })

    if (error) throw new Error(error.message)

    redirect('/dashboard/content')
}

export async function submitDeal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!business) throw new Error('No business found')

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const deal_type = formData.get('deal_type') as string
    const days_active = formData.getAll('days_active') as string[]

    const { error } = await supabase
        .from('deals')
        .insert({
            business_id: business.id,
            title,
            description,
            deal_type,
            days_active,
            is_active: false // Needs approval or just draft mode
        })

    if (error) throw new Error(error.message)

    redirect('/dashboard/content')
}
