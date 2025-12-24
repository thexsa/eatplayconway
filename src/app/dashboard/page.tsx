import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, PlusCircle, CheckCircle, Clock } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user has a business
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, businesses(*)')
        .eq('id', user.id)
        .single()

    const hasBusiness = profile?.businesses && profile.businesses.length > 0

    if (!hasBusiness) {
        redirect('/dashboard/onboarding')
    }

    const business = (profile.businesses as any)[0]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="font-serif text-3xl font-medium text-text-dark">Welcome, {user.user_metadata.full_name || 'Business Owner'}</h1>
                <p className="text-gray-500 mt-2">Here's what's happening at {business.name}.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4 text-brand-orange">
                        <CheckCircle className="size-6" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Live Items</h3>
                    </div>
                    <p className="text-4xl font-serif text-text-dark">--</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4 text-brand-yellow">
                        <Clock className="size-6" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Pending Approval</h3>
                    </div>
                    <p className="text-4xl font-serif text-text-dark">--</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4 text-brand-red">
                        <PlusCircle className="size-6" />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Impressions</h3>
                    </div>
                    <p className="text-4xl font-serif text-text-dark">Premium Only</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-brand-orange rounded-3xl p-8 text-white relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-serif mb-2">Grow your local reach</h2>
                        <p className="text-white/80">Submit upcoming events or specialized deals to reach more Conway residents.</p>
                    </div>
                    <Link
                        href="/dashboard/submit"
                        className="bg-white text-brand-orange px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-cream transition-colors"
                    >
                        Submit Content
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 size-48 bg-white/5 rounded-full -ml-20 -mb-20 group-hover:scale-110 transition-transform duration-700"></div>
            </div>
        </div>
    )
}
