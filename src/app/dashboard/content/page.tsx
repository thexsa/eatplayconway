import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { Calendar, Tag, Clock, CheckCircle, XCircle, ChevronRight, Search } from 'lucide-react'

export default async function ContentPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single()

    if (!business) redirect('/dashboard/onboarding')

    // Fetch Events and Deals
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })

    const { data: deals } = await supabase
        .from('deals')
        .select('*')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })

    const statusColors = {
        published: 'bg-green-100 text-green-700',
        draft: 'bg-yellow-100 text-yellow-700',
        rejected: 'bg-red-100 text-red-700',
        raw: 'bg-gray-100 text-gray-700'
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl font-medium text-text-dark">My Content</h1>
                    <p className="text-gray-500 mt-2">Manage your events, specials, and promotions.</p>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search your content..."
                        className="rounded-2xl border-gray-100 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-orange/50 transition-all shadow-sm w-full md:w-64"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Events Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-text-dark/40 pb-2 border-b border-gray-100">
                        <Calendar className="size-5" />
                        <h2 className="font-bold text-sm uppercase tracking-widest">Events</h2>
                    </div>

                    <div className="space-y-4">
                        {events?.map((event) => (
                            <div key={event.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${statusColors[event.status as keyof typeof statusColors] || statusColors.raw}`}>
                                                {event.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                                                ID: {event.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-text-dark group-hover:text-brand-orange transition-colors truncate">{event.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock className="size-3" />
                                            {format(new Date(event.start_time), 'MMM d, yyyy • h:mm a')}
                                        </p>
                                    </div>
                                    <button className="text-gray-300 hover:text-brand-orange transition-colors">
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {events?.length === 0 && (
                            <div className="bg-brand-cream/20 border border-dashed border-gray-200 rounded-3xl py-12 text-center text-gray-400">
                                <p className="text-sm">No events found. Start by submitting one!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Deals Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-text-dark/40 pb-2 border-b border-gray-100">
                        <Tag className="size-5" />
                        <h2 className="font-bold text-sm uppercase tracking-widest">Specials & Deals</h2>
                    </div>

                    <div className="space-y-4">
                        {deals?.map((deal) => (
                            <div key={deal.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded-full ${deal.is_active ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {deal.is_active ? 'Active' : 'Pending Approval'}
                                            </span>
                                            <span className="text-[10px] font-bold text-text-dark/30 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded-full">
                                                {deal.deal_type}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-text-dark group-hover:text-brand-orange transition-colors truncate">{deal.title}</h3>
                                        <div className="flex gap-1 mt-2">
                                            {deal.days_active?.map((day: string) => (
                                                <span key={day} className="text-[9px] font-black uppercase text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">{day}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="text-gray-300 hover:text-brand-orange transition-colors">
                                        <ChevronRight className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {deals?.length === 0 && (
                            <div className="bg-brand-cream/20 border border-dashed border-gray-200 rounded-3xl py-12 text-center text-gray-400">
                                <p className="text-sm">No deals found. Start by submitting one!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
