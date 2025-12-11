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
                ? 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900/30 dark:text-zinc-400'
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
                className="text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
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
                className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
            >
                <Trash2 className="size-4" />
            </button>
        </div>
    )
}
