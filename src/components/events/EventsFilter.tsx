'use client'

import { Calendar, Filter, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export function EventsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Simple state just to show interactivity for now
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const currentFilter = searchParams.get('filter')

    function applyFilter(value: string | null) {
        const params = new URLSearchParams(searchParams)
        if (value) {
            params.set('filter', value)
        } else {
            params.delete('filter')
        }
        startTransition(() => {
            router.push(`/events?${params.toString()}`)
        })
    }

    return (
        <div className="relative">
            <div className="flex gap-2">
                <div className="relative">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${currentFilter
                                ? 'bg-brand-orange border-brand-orange text-white hover:bg-orange-600'
                                : 'bg-transparent border-gray-200 text-text-dark hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="size-4" />
                        {currentFilter === 'weekend' ? 'This Weekend' : currentFilter === 'today' ? 'Today' : 'Filters'}
                    </button>

                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-2 shadow-lg z-10 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={() => { applyFilter('today'); setIsFilterOpen(false) }}
                                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-brand-cream hover:text-text-dark"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => { applyFilter('weekend'); setIsFilterOpen(false) }}
                                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-brand-cream hover:text-text-dark"
                            >
                                This Weekend
                            </button>
                            <div className="my-1 h-px bg-gray-100" />
                            <button
                                onClick={() => { applyFilter(null); setIsFilterOpen(false) }}
                                className="block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>

                <button
                    disabled // Placeholder for date range picker
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-transparent px-4 py-2 text-sm font-semibold text-gray-400 cursor-not-allowed"
                >
                    <Calendar className="size-4" /> Date Range
                </button>
            </div>
        </div>
    )
}
