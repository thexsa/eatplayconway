'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { slugify } from '@/utils/slugify'

export async function claimBusiness(businessId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('businesses')
        .update({ owner_id: user.id })
        .eq('id', businessId)
        .is('owner_id', null)

    if (error) throw new Error(error.message)

    redirect('/dashboard')
}

export async function requestNewBusiness(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const website = formData.get('website') as string
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('businesses')
        .insert({
            name,
            slug: slugify(name) + '-' + Math.random().toString(36).slice(-4),
            address,
            website_url: website,
            description,
            owner_id: user.id,
            subscription_tier: 'free'
        })

    if (error) throw new Error(error.message)

    redirect('/dashboard')
}
