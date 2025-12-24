'use client'

import { createClient } from '@/utils/supabase/client'

export async function login(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        throw new Error(error.message)
    }
}

export async function signup(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    })

    if (error) {
        throw new Error(error.message)
    }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
}
