import { Plus, RefreshCcw } from 'lucide-react'
import { getAllSources } from '@/lib/api/admin'
import Link from 'next/link'

import { SourceActionButtons, SourceToggleConfig } from '@/components/admin/SourceActions'

export default async function SourcesPage() {
    const sources = await getAllSources()

    function formatTimeAgo(dateString: string | null) {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return `${diffInSeconds}s ago`
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
        return `${Math.floor(diffInSeconds / 86400)}d ago`
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Sources</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage {sources?.length || 0} automated scrapers and integrations.</p>
                </div>
                <Link href="/admin/sources/new" className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Plus className="size-4" /> Add Source
                </Link>
            </div>

            <div className="rounded-xl border bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Type</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Frequency</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Last Run</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-zinc-800">
                        {sources?.map((source) => (
                            <tr key={source.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                                    <div className="flex flex-col">
                                        <span>{source.name || 'Unnamed Source'}</span>
                                        <span className="text-xs text-zinc-400">{source.source_url}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30">
                                        {source.source_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">Every {source.frequency_hours}h</td>
                                <td className="px-6 py-4">
                                    <SourceToggleConfig id={source.id} isActive={source.is_active || false} />
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        {formatTimeAgo(source.last_scraped_at)}
                                        {source.last_status === 'error' && (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400" title={source.error_log || 'Unknown Error'}>
                                                Error
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <SourceActionButtons id={source.id} />
                                </td>
                            </tr>
                        ))}
                        {(!sources || sources.length === 0) && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                    No sources configured. Add one to start scraping!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
