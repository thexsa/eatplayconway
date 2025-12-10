import { ArrowUpRight, ArrowDownRight, Users, Calendar, DollarSign, Activity } from 'lucide-react'

const stats = [
    { name: 'Total Events', value: '1,203', change: '+12.5%', changeType: 'increase', icon: Calendar },
    { name: 'Active Deals', value: '42', change: '-2.1%', changeType: 'decrease', icon: DollarSign },
    { name: 'Total Views', value: '45.2k', change: '+24.3%', changeType: 'increase', icon: Users },
    { name: 'Scrape Health', value: '98.5%', change: '+1.2%', changeType: 'increase', icon: Activity },
]

export default function AdminDashboardPage() {
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
                            <span className={`flex items-center text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                {stat.changeType === 'increase' ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="font-semibold">Recent Event Submissions</h3>
                    <div className="mt-6 flex h-64 items-center justify-center text-zinc-400 border-2 border-dashed rounded-lg">
                        Chart Placeholder
                    </div>
                </div>
                <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                    <h3 className="font-semibold">Scraper Activity Log</h3>
                    <div className="mt-6 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 rounded-full bg-green-500" />
                                    <span>Facebook Page Scrape (JJ&apos;s Grill)</span>
                                </div>
                                <span className="text-zinc-500">2m ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
