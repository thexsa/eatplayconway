import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { claimBusiness, requestNewBusiness } from './actions'
import { Building2, Plus, Search, MapPin, Globe, ArrowRight } from 'lucide-react'

export default async function OnboardingPage({ searchParams }: { searchParams: { q?: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch businesses with no owner
    let query = supabase
        .from('businesses')
        .select('*')
        .is('owner_id', null)
        .order('name', { ascending: true })
        .limit(10)

    if (searchParams.q) {
        query = query.ilike('name', `%${searchParams.q}%`)
    }

    const { data: availableBusinesses } = await query

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-16">
                <span className="text-brand-orange font-bold text-sm uppercase tracking-widest mb-4 block">Onboarding</span>
                <h1 className="font-serif text-5xl font-medium text-text-dark mb-4">Let's find your business</h1>
                <p className="text-xl text-gray-500 max-w-2xl mx-auto">Select your business from the list to claim it, or create a new listing if you're not already on Eat Play Conway.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Column 1: Search & Claim */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-orange/5 border border-gray-100">
                        <h2 className="text-2xl font-serif mb-6 flex items-center gap-3">
                            <Search className="size-6 text-brand-orange" />
                            Claim Existing Listing
                        </h2>

                        <form className="relative mb-8">
                            <input
                                type="text"
                                name="q"
                                defaultValue={searchParams.q}
                                placeholder="Search by business name..."
                                className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all shadow-inner"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                        </form>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {availableBusinesses?.map((biz) => (
                                <form key={biz.id} action={claimBusiness.bind(null, biz.id)}>
                                    <button
                                        type="submit"
                                        className="w-full text-left p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-brand-orange/20 hover:shadow-lg transition-all group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-text-dark group-hover:text-brand-orange transition-colors">{biz.name}</h3>
                                                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    {biz.address || 'Conway, AR'}
                                                </p>
                                            </div>
                                            <div className="bg-brand-orange/10 text-brand-orange p-2 rounded-xl group-hover:bg-brand-orange group-hover:text-white transition-all">
                                                <ArrowRight className="size-4" />
                                            </div>
                                        </div>
                                    </button>
                                </form>
                            ))}
                            {availableBusinesses?.length === 0 && (
                                <div className="text-center py-12 text-gray-400 italic">
                                    No unclaimed businesses found matching "{searchParams.q}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: Create New */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-xl shadow-brand-orange/5 border border-brand-orange/10 relative overflow-hidden">
                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 right-0 size-32 bg-brand-orange/5 rounded-full -mr-16 -mt-16"></div>

                        <h2 className="text-2xl font-serif mb-6 flex items-center gap-3 relative z-10">
                            <Plus className="size-6 text-brand-orange" />
                            Request New Listing
                        </h2>

                        <form action={requestNewBusiness} className="space-y-4 relative z-10">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Business Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="e.g. Rogers Plaza Cafe"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Street Address</label>
                                <input
                                    name="address"
                                    type="text"
                                    placeholder="123 Front St, Conway, AR"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Website URL</label>
                                <input
                                    name="website"
                                    type="url"
                                    placeholder="https://example.com"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Brief Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    placeholder="Tell us about your business..."
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-brand-orange text-white py-4 rounded-2xl font-bold hover:bg-brand-red shadow-lg shadow-brand-orange/20 transition-all flex items-center justify-center gap-2"
                            >
                                Submit Listing Request
                                <ArrowRight className="size-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
