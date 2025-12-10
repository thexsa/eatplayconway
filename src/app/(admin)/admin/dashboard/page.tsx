import { ArrowUpRight, ArrowDownRight, Users, Calendar, DollarSign, Activity, ListTodo } from 'lucide-react'
import { getDashboardStats } from '@/lib/api/admin'
import Link from 'next/link'

export default async function AdminDashboardPage() {
    const data = await getDashboardStats()

    const stats = [
        { name: 'Total Events', value: data.totalEvents.toString(), change: 'Database', changeType: 'neutral', icon: Calendar },
        { name: 'Active Deals', value: data.activeDeals.toString(), change: 'Live', changeType: 'increase', icon: DollarSign },
        { name: 'Active Sources', value: data.activeSources.toString(), change: 'Monitoring', changeType: 'neutral', icon: Activity },
        { name: 'System Status', value: 'Online', change: 'Vercel', changeType: 'increase', icon: Users }, // Placeholder for Views
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Platform overview and performance metrics.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="flex flex-col rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</span>
                            <stat.icon className="size-5 text-zinc-400" />
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold">{stat.value}</span>
                            <span className="flex items-center text-sm font-medium text-zinc-500">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold">Quick Actions</h3>
                    </div>
                    <div className="grid gap-4">
                        <Link href="/admin/events" className="flex items-center justify-between p-4 rounded-lg border hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
                                    <ListTodo className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium">Review Pending Events</h4>
                                    <p className="text-sm text-zinc-500">Moderation queue needs attention</p>
                                </div>
                            </div>
                            <ArrowUpRight className="size-4 text-zinc-400" />
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="font-semibold">Scraper Activity Log</h3>
                    <div className="mt-6 flex h-40 items-center justify-center text-zinc-400 border-2 border-dashed rounded-lg">
                        Logs coming soon...
                    </div>
                </div>
            </div>
        </div>
    )
}
