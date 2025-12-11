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
                <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark">Dashboard</h1>
                <p className="text-gray-500">Platform overview and performance metrics.</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.name} className="flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                            <stat.icon className="size-5 text-gray-400" />
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-text-dark">{stat.value}</span>
                            <span className="flex items-center text-sm font-medium text-gray-500">
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-text-dark">Quick Actions</h3>
                    </div>
                    <div className="grid gap-4">
                        <Link href="/admin/events" className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-brand-cream/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <ListTodo className="size-5" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-text-dark">Review Pending Events</h4>
                                    <p className="text-sm text-gray-500">Moderation queue needs attention</p>
                                </div>
                            </div>
                            <ArrowUpRight className="size-4 text-gray-400" />
                        </Link>
                    </div>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h3 className="font-semibold text-text-dark">Scraper Activity Log</h3>
                    <div className="mt-6 flex h-40 items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
                        Logs coming soon...
                    </div>
                </div>
            </div>
        </div>
    )
}
