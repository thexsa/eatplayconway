import { AdminSidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans text-zinc-900 dark:text-zinc-50">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-8 dark:bg-zinc-950/50">
                {children}
            </main>
        </div>
    )
}
