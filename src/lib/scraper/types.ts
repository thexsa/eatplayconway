/* eslint-disable @typescript-eslint/no-explicit-any */
export type ScraperType = 'facebook_page' | 'instagram' | 'website_rss' | 'website_html' | 'gmb' | 'api_integration'

export interface ScrapeJob {
    sourceId: string
    url: string
    type: ScraperType
    config: Record<string, any>
}

export interface NormalizedEvent {
    title: string
    start_time: string // ISO String
    end_time?: string // ISO String
    description?: string
    url?: string
    image_url?: string
    location?: string
    price_min?: number
    price_max?: number
    raw_data?: Record<string, any>
}

export interface ScraperRunner {
    supports(type: ScraperType): boolean
    run(job: ScrapeJob): Promise<NormalizedEvent[]>
}

export interface ScrapeResult {
    success: boolean
    events: NormalizedEvent[]
    error?: string
}
