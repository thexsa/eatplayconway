'use client'

import React, { useState } from 'react'
import { submitEvent, submitDeal } from './actions'
import { Calendar, Tag, Info, Image as ImageIcon, Plus, ArrowRight, Loader2 } from 'lucide-react'

export default function SubmitPage() {
    const [type, setType] = useState<'event' | 'deal'>('event')
    const [isLoading, setIsLoading] = useState(false)

    return (
        <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10">
                <h1 className="font-serif text-3xl font-medium text-text-dark">Submit New Content</h1>
                <p className="text-gray-500 mt-2">Request to add an event, special, or sale to the site.</p>
            </div>

            {/* Type Selector */}
            <div className="flex p-1 bg-brand-cream rounded-2xl mb-10 w-fit">
                <button
                    onClick={() => setType('event')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${type === 'event' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Calendar className="size-4" />
                    Event
                </button>
                <button
                    onClick={() => setType('deal')}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${type === 'deal' ? 'bg-white text-brand-orange shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Tag className="size-4" />
                    Special / Deal
                </button>
            </div>

            {/* Form */}
            <form
                action={async (formData) => {
                    setIsLoading(true)
                    try {
                        if (type === 'event') await submitEvent(formData)
                        else await submitDeal(formData)
                    } catch (e) {
                        alert(e instanceof Error ? e.message : 'Something went wrong')
                        setIsLoading(false)
                    }
                }}
                className="space-y-8"
            >
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                                {type === 'event' ? 'Event Title' : 'Special Name'}
                            </label>
                            <input
                                name="title"
                                type="text"
                                required
                                placeholder={type === 'event' ? 'e.g. Annual Block Party' : 'e.g. Taco Tuesday Specials'}
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                            />
                        </div>

                        {type === 'event' ? (
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Start Date & Time</label>
                                <input
                                    name="start_time"
                                    type="datetime-local"
                                    required
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Deal Type</label>
                                <select
                                    name="deal_type"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all appearance-none"
                                >
                                    <option value="food">Food Special</option>
                                    <option value="drink">Drink Special / Happy Hour</option>
                                    <option value="sale">Promotion / Sale</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
                                {type === 'event' ? 'Categories (comma separated)' : 'Active Days'}
                            </label>
                            {type === 'event' ? (
                                <input
                                    name="categories"
                                    type="text"
                                    placeholder="e.g. Music, Family, Free"
                                    className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                        <label key={day} className="flex items-center gap-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 hover:border-brand-orange/20 cursor-pointer transition-all has-[:checked]:bg-brand-orange has-[:checked]:text-white has-[:checked]:border-brand-orange">
                                            <input type="checkbox" name="days_active" value={day} className="hidden" />
                                            <span className="text-xs font-bold uppercase">{day}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Details / Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                placeholder="Describe what's happening..."
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 px-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all resize-none"
                            />
                        </div>

                        {type === 'event' && (
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Image URL (Optional)</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-300" />
                                    <input
                                        name="image_url"
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 outline-none focus:border-brand-orange/50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-8 bg-brand-orange/5 rounded-3xl border border-brand-orange/10 border-dashed">
                    <div className="flex gap-3 text-sm text-text-dark/70">
                        <Info className="size-5 shrink-0 text-brand-orange" />
                        <p>All submissions are reviewed by our team before going live. Most items are approved within 24 hours.</p>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-brand-orange text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-red shadow-lg shadow-brand-orange/20 transition-all shrink-0 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-4" />}
                        Submit for Review
                    </button>
                </div>
            </form>
        </div>
    )
}
