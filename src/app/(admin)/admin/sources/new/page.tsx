import { AddSourceForm } from '@/components/admin/AddSourceForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AddSourcePage() {
    return (
        <div className="space-y-8 max-w-2xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/sources" className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">
                    <ArrowLeft className="size-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Add Data Source</h1>
                    <p className="text-zinc-500 dark:text-zinc-400">Configure a new scraper or feed ingestion.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <AddSourceForm />
            </div>
        </div>
    )
}
