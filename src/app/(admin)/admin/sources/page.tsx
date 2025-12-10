import { Plus } from 'lucide-react'

// Mock Sources
const sources = [
    { id: 1, name: 'JJ\'s Grill Facebook', type: 'Facebook Page', status: 'Active', frequency: '6h', lastRun: '2m ago' },
    { id: 2, name: 'Conway Chamber RSS', type: 'RSS Feed', status: 'Active', frequency: '24h', lastRun: '1h ago' },
    { id: 3, name: 'UCA Sports Calendar', type: 'Website HTML', status: 'Error', frequency: '12h', lastRun: '5h ago' },
]

export default function SourcesPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Sources</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Manage automated scrapers and API integrations.</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Plus className="size-4" /> Add Source
                </button>
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
                        {sources.map((source) => (
                            <tr key={source.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">{source.name}</td>
                                <td className="px-6 py-4 text-zinc-500">{source.type}</td>
                                <td className="px-6 py-4 text-zinc-500">{source.frequency}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${source.status === 'Active'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        {source.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">{source.lastRun}</td>
                                <td className="px-6 py-4">
                                    <button className="text-orange-600 hover:text-orange-500 font-medium">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
