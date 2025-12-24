import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { updateBusinessProfile } from './actions'
import { Store, MapPin, Globe, AlignLeft, Save, AlertCircle } from 'lucide-react'

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: business } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()

    if (!business) {
        redirect('/dashboard/onboarding')
    }

    return (
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-medium text-text-dark">Business Profile</h1>
                <p className="text-gray-500 mt-2">Manage how your business appears to the community.</p>
            </div>

            <form action={updateBusinessProfile.bind(null, business.id)} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Business Name</label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    defaultValue={business.name}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                <input
                                    name="address"
                                    type="text"
                                    defaultValue={business.address}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Website</label>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                <input
                                    name="website"
                                    type="url"
                                    defaultValue={business.website_url}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Public Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-4 top-4 size-5 text-gray-300" />
                                <textarea
                                    name="description"
                                    rows={5}
                                    defaultValue={business.description}
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all resize-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4 bg-brand-cream/50 p-6 rounded-3xl border border-brand-orange/10">
                    <div className="flex gap-3 text-sm text-brand-orange/80">
                        <AlertCircle className="size-5 shrink-0" />
                        <p>Updating your business name may change your public URL slug. We recommend keeping it consistent.</p>
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-brand-orange text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-red shadow-lg shadow-brand-orange/20 transition-all shrink-0"
                    >
                        <Save className="size-4" />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}
