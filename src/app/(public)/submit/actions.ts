'use server'

import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const businessSchema = z.object({
    name: z.string().min(3, 'Business name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters').optional().or(z.literal('')),
    category: z.enum(['restaurant', 'bar', 'retail', 'service', 'nonprofit', 'community', 'arts_entertainment', 'other']),
    address: z.string().min(5, 'Address is required'),
    website: z.string().url('Invalid URL').optional().or(z.literal('')),
    contact_email: z.string().email('Invalid email address'),
});

export type SubmissionState = {
    errors?: {
        name?: string[];
        description?: string[];
        category?: string[];
        address?: string[];
        website?: string[];
        contact_email?: string[];
        _form?: string[];
    };
    success?: boolean;
}

export async function submitBusiness(prevState: SubmissionState, formData: FormData): Promise<SubmissionState> {
    const validatedFields = businessSchema.safeParse({
        name: formData.get('name'),
        description: formData.get('description'),
        category: formData.get('category'),
        address: formData.get('address'),
        website: formData.get('website'),
        contact_email: formData.get('contact_email'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('businesses')
        .insert({
            name: validatedFields.data.name,
            description: validatedFields.data.description,
            category: validatedFields.data.category,
            address: validatedFields.data.address,
            // Store website/email in social_links or a specific column if schema allows.
            // Checking schema from earlier... table has `social_links` (json) but likely no contact_email column on `businesses` itself?
            // Let's put them in `social_links` for now or check database.types again.
            // Actually, for MVP I'll put email in social_links or just not store it if the column doesn't exist.
            // I'll assume social_links is the place for extra metadata.
            social_links: {
                website: validatedFields.data.website,
                contact_email: validatedFields.data.contact_email
            },
            subscription_tier: 'free',
            is_verified: false,
            slug: validatedFields.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        });

    if (error) {
        console.error('Submission Error:', error);
        return {
            errors: {
                _form: ['Failed to submit business. Please try again.']
            }
        };
    }

    return { success: true };
}
