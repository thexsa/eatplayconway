'use client'

import { Play, Pause, RefreshCcw, Trash2 } from 'lucide-react'
import { toggleSource, deleteSource, runSource } from '@/app/(admin)/admin/sources/actions'
import { useTransition } from 'react'

export function SourceToggleConfig({ id, isActive }: { id: string, isActive: boolean }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => startTransition(async () => { await toggleSource(id, isActive) })}
            disabled={isPending}
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${isActive
                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
        >
            {isActive ? 'Active' : 'Paused'}
        </button>
    )
}

export function SourceActionButtons({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => startTransition(async () => { await runSource(id) })}
                disabled={isPending}
                title="Run Scraper Now"
                className="text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
            >
                <RefreshCcw className={`size-4 ${isPending ? 'animate-spin' : ''}`} />
            </button>
            <button
                onClick={() => {
                    if (confirm('Are you sure you want to delete this source?')) {
                        startTransition(async () => { await deleteSource(id) })
                    }
                }}
                disabled={isPending}
                title="Delete Source"
                className="text-gray-400 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    )
}
