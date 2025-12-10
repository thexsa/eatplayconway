export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    role: 'admin' | 'manager' | 'moderator' | 'public'
                    full_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    role?: 'admin' | 'manager' | 'moderator' | 'public'
                    full_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    role?: 'admin' | 'manager' | 'moderator' | 'public'
                    full_name?: string | null
                    created_at?: string
                }
            }
            businesses: {
                Row: {
                    id: string
                    owner_id: string | null
                    name: string
                    slug: string
                    description: string | null
                    category: 'restaurant' | 'bar' | 'retail' | 'service' | 'nonprofit' | 'community' | 'arts_entertainment' | 'other'
                    address: string | null
                    geo_lat: number | null
                    geo_lng: number | null
                    social_links: Json | null
                    subscription_tier: 'free' | 'basic' | 'premium'
                    is_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    owner_id?: string | null
                    name: string
                    slug: string
                    description?: string | null
                    category?: 'restaurant' | 'bar' | 'retail' | 'service' | 'nonprofit' | 'community' | 'arts_entertainment' | 'other'
                    address?: string | null
                    geo_lat?: number | null
                    geo_lng?: number | null
                    social_links?: Json | null
                    subscription_tier?: 'free' | 'basic' | 'premium'
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string | null
                    name?: string
                    slug?: string
                    description?: string | null
                    category?: 'restaurant' | 'bar' | 'retail' | 'service' | 'nonprofit' | 'community' | 'arts_entertainment' | 'other'
                    address?: string | null
                    geo_lat?: number | null
                    geo_lng?: number | null
                    social_links?: Json | null
                    subscription_tier?: 'free' | 'basic' | 'premium'
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            scrape_sources: {
                Row: {
                    id: string
                    business_id: string | null
                    source_type: 'facebook_page' | 'instagram' | 'website_rss' | 'website_html' | 'gmb' | 'api_integration'
                    difficulty: 'easy' | 'hard'
                    source_url: string
                    config_json: Json | null
                    frequency_hours: number
                    last_scraped_at: string | null
                    last_status: string | null
                    error_log: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    business_id?: string | null
                    source_type: 'facebook_page' | 'instagram' | 'website_rss' | 'website_html' | 'gmb' | 'api_integration'
                    difficulty?: 'easy' | 'hard'
                    source_url: string
                    config_json?: Json | null
                    frequency_hours?: number
                    last_scraped_at?: string | null
                    last_status?: string | null
                    error_log?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string | null
                    source_type?: 'facebook_page' | 'instagram' | 'website_rss' | 'website_html' | 'gmb' | 'api_integration'
                    difficulty?: 'easy' | 'hard'
                    source_url?: string
                    config_json?: Json | null
                    frequency_hours?: number
                    last_scraped_at?: string | null
                    last_status?: string | null
                    error_log?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    business_id: string | null
                    source_id: string | null
                    title: string
                    slug: string
                    start_time: string
                    end_time: string | null
                    description_raw: string | null
                    description_summary: string | null
                    categories: string[] | null
                    ai_confidence: number | null
                    price_type: 'free' | 'paid' | 'ticketed'
                    price_min: number | null
                    price_max: number | null
                    ticket_url: string | null
                    image_url: string | null
                    is_featured: boolean
                    status: 'raw' | 'enriched' | 'published' | 'rejected' | 'archived'
                    created_at: string
                }
                Insert: {
                    id?: string
                    business_id?: string | null
                    source_id?: string | null
                    title: string
                    slug: string
                    start_time: string
                    end_time?: string | null
                    description_raw?: string | null
                    description_summary?: string | null
                    categories?: string[] | null
                    ai_confidence?: number | null
                    price_type?: 'free' | 'paid' | 'ticketed'
                    price_min?: number | null
                    price_max?: number | null
                    ticket_url?: string | null
                    image_url?: string | null
                    is_featured?: boolean
                    status?: 'raw' | 'enriched' | 'published' | 'rejected' | 'archived'
                    created_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string | null
                    source_id?: string | null
                    title?: string
                    slug?: string
                    start_time?: string
                    end_time?: string | null
                    description_raw?: string | null
                    description_summary?: string | null
                    categories?: string[] | null
                    ai_confidence?: number | null
                    price_type?: 'free' | 'paid' | 'ticketed'
                    price_min?: number | null
                    price_max?: number | null
                    ticket_url?: string | null
                    image_url?: string | null
                    is_featured?: boolean
                    status?: 'raw' | 'enriched' | 'published' | 'rejected' | 'archived'
                    created_at?: string
                }
            }
            deals: {
                Row: {
                    id: string
                    business_id: string | null
                    source_id: string | null
                    title: string
                    description: string | null
                    promo_code: string | null
                    deal_type: 'happy_hour' | 'discount' | 'bogo' | 'special'
                    valid_from: string | null
                    valid_until: string | null
                    active_days: string[] | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    business_id?: string | null
                    source_id?: string | null
                    title: string
                    description?: string | null
                    promo_code?: string | null
                    deal_type?: 'happy_hour' | 'discount' | 'bogo' | 'special'
                    valid_from?: string | null
                    valid_until?: string | null
                    active_days?: string[] | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    business_id?: string | null
                    source_id?: string | null
                    title?: string
                    description?: string | null
                    promo_code?: string | null
                    deal_type?: 'happy_hour' | 'discount' | 'bogo' | 'special'
                    valid_from?: string | null
                    valid_until?: string | null
                    active_days?: string[] | null
                    is_active?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
