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
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark">Data Sources</h1>
                    <p className="text-gray-500">Manage {sources?.length || 0} automated scrapers and integrations.</p>
                </div>
                <Link href="/admin/sources/new" className="flex items-center gap-2 rounded-lg bg-text-dark px-4 py-2 text-sm font-semibold text-white hover:bg-black transition-colors">
                    <Plus className="size-4" /> Add Source
                </Link>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-brand-cream border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Type</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Frequency</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Last Run</th>
                            <th className="px-6 py-4 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sources?.map((source) => (
                            <tr key={source.id} className="hover:bg-brand-cream/50 transition-colors">
                                <td className="px-6 py-4 font-medium text-text-dark">
                                    <div className="flex flex-col">
                                        <span>{source.name || 'Unnamed Source'}</span>
                                        <span className="text-xs text-gray-400">{source.source_url}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {source.source_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">Every {source.frequency_hours}h</td>
                                <td className="px-6 py-4">
                                    <SourceToggleConfig id={source.id} isActive={source.is_active || false} />
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    <div className="flex items-center gap-2">
                                        {formatTimeAgo(source.last_scraped_at)}
                                        {source.last_status === 'error' && (
                                            <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800" title={source.error_log || 'Unknown Error'}>
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
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
