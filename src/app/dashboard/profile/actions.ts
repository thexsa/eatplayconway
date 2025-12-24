'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/utils/slugify'

export async function updateBusinessProfile(businessId: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const website = formData.get('website') as string
    const description = formData.get('description') as string

    // Update query
    const { error } = await supabase
        .from('businesses')
        .update({
            name,
            address,
            website_url: website,
            description,
        })
        .eq('id', businessId)
        .eq('owner_id', user.id)

    if (error) throw new Error(error.message)

    revalidatePath('/dashboard/profile')
    revalidatePath(`/eat/${slugify(name)}`) // Potential slug change issue if not handled carefully, but for now simple
}
