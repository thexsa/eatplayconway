import { Zap, Crown, Star, ArrowRight, Check } from 'lucide-react'

export default function PromotePage() {
    return (
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-12">
                <h1 className="font-serif text-3xl font-medium text-text-dark">Grow Your Visibility</h1>
                <p className="text-gray-500 mt-2">Get featured to reach thousands of local residents and visitors.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Priority Placement */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-orange/20 transition-all group relative overflow-hidden">
                    <div className="size-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="size-6" />
                    </div>
                    <h3 className="font-serif text-xl mb-4 text-text-dark">Priority Placement</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">Your business and events will appear at the top of search results and category listings.</p>

                    <ul className="space-y-3 mb-10">
                        {['Rank above competitors', 'Highlighted cards', 'AI search priority'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-xs font-bold text-text-dark/60">
                                <Check className="size-3 text-brand-orange" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full bg-brand-cream text-brand-orange font-bold py-4 rounded-2xl hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2">
                        Request Access
                        <ArrowRight className="size-4" />
                    </button>

                    <div className="absolute top-0 right-0 size-24 bg-brand-orange/5 rounded-full -mr-12 -mt-12"></div>
                </div>

                {/* Featured Listing - Popular Choice */}
                <div className="bg-text-dark rounded-3xl p-8 border border-gray-800 shadow-2xl shadow-text-dark/30 hover:shadow-text-dark/50 transition-all group relative overflow-hidden transform md:scale-105 z-10">
                    <div className="size-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-lg shadow-brand-orange/40">
                        <Crown className="size-6" />
                    </div>
                    <div className="absolute top-6 right-6 px-3 py-1 bg-brand-orange text-[10px] font-black text-white uppercase tracking-widest rounded-full">Popular</div>

                    <h3 className="font-serif text-xl mb-4 text-white">Featured Listing</h3>
                    <p className="text-sm text-gray-400 mb-8 leading-relaxed">Dedicated spot in our weekly newsletter and homepage "Top Picks" carousel.</p>

                    <ul className="space-y-3 mb-10">
                        {['Homepage spotlight', 'Newsletter mention', 'Social media feature'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-xs font-bold text-white/80">
                                <Check className="size-3 text-brand-orange" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full bg-brand-orange text-white font-bold py-4 rounded-2xl hover:bg-brand-red transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-orange/20">
                        Get Featured
                        <ArrowRight className="size-4" />
                    </button>
                </div>

                {/* Verified Business */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-brand-yellow/30 transition-all group relative overflow-hidden">
                    <div className="size-12 rounded-2xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Star className="size-6" />
                    </div>
                    <h3 className="font-serif text-xl mb-4 text-text-dark">Verified Badge</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">Establish trust with our community with a verified checkmark on your profile.</p>

                    <ul className="space-y-3 mb-10">
                        {['Trust badge on profile', 'Enhanced credibility', 'Direct support link'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-xs font-bold text-text-dark/60">
                                <Check className="size-3 text-brand-yellow" />
                                {item}
                            </li>
                        ))}
                    </ul>

                    <button className="w-full bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl hover:bg-brand-yellow hover:text-white transition-all flex items-center justify-center gap-2">
                        Request Verification
                        <ArrowRight className="size-4" />
                    </button>

                    <div className="absolute top-0 right-0 size-24 bg-brand-yellow/5 rounded-full -mr-12 -mt-12"></div>
                </div>
            </div>

            {/* Custom Requests */}
            <div className="mt-16 bg-white p-10 rounded-[2.5rem] border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 group">
                <div className="max-w-md text-center md:text-left">
                    <h2 className="font-serif text-2xl mb-3 text-text-dark">Custom Advertising?</h2>
                    <p className="text-gray-500">Have something specific in mind like a site-wide banner or sponsored story? Our team would love to help you build a custom campaign.</p>
                </div>
                <button className="bg-brand-orange/10 text-brand-orange px-10 py-5 rounded-3xl font-bold hover:bg-brand-orange hover:text-white transition-all group-hover:translate-x-1 whitespace-nowrap">
                    Contact Ad Team
                </button>
            </div>
        </div>
    )
}
