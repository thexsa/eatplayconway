'use client'

import { useActionState } from 'react';
import { submitBusiness } from '@/app/(public)/submit/actions';
import { Loader2, CheckCircle } from 'lucide-react';

export default function BusinessSubmissionForm() {
    const [state, action, isPending] = useActionState(submitBusiness, {});

    if (state.success) {
        return (
            <div className="rounded-xl border border-green-100 bg-green-50 p-8 text-center max-w-lg mx-auto">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle className="size-6" />
                </div>
                <h3 className="text-xl font-serif font-bold text-green-900">Submission Received!</h3>
                <p className="mt-2 text-green-800">
                    Thanks for submitting your business. We will review it shortly and send you an email once it's live on EatPlayConway.
                </p>
                <div className="mt-6">
                    <button
                        onClick={() => window.location.reload()}
                        className="text-sm font-medium text-green-700 hover:text-green-800 underline"
                    >
                        Submit another business
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form action={action} className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Business Name</label>
                <div className="mt-2">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    />
                </div>
                {state.errors?.name && <p className="mt-2 text-sm text-red-600">{state.errors.name[0]}</p>}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
                <div className="mt-2">
                    <select
                        id="category"
                        name="category"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    >
                        <option value="restaurant">Restaurant</option>
                        <option value="bar">Bar / Nightlife</option>
                        <option value="retail">Shopping / Retail</option>
                        <option value="service">Service</option>
                        <option value="arts_entertainment">Arts & Entertainment</option>
                        <option value="community">Community / Non-Profit</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                {state.errors?.category && <p className="mt-2 text-sm text-red-600">{state.errors.category[0]}</p>}
            </div>

            <div>
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                <div className="mt-2">
                    <input
                        id="address"
                        name="address"
                        type="text"
                        required
                        placeholder="123 Oak St, Conway, AR"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    />
                </div>
                {state.errors?.address && <p className="mt-2 text-sm text-red-600">{state.errors.address[0]}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description (Optional)</label>
                <div className="mt-2">
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    />
                </div>
                {state.errors?.description && <p className="mt-2 text-sm text-red-600">{state.errors.description[0]}</p>}
            </div>

            <div>
                <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">Website (Optional)</label>
                <div className="mt-2">
                    <input
                        id="website"
                        name="website"
                        type="url"
                        placeholder="https://"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    />
                </div>
                {state.errors?.website && <p className="mt-2 text-sm text-red-600">{state.errors.website[0]}</p>}
            </div>

            <div>
                <label htmlFor="contact_email" className="block text-sm font-medium leading-6 text-gray-900">Contact Email</label>
                <p className="text-xs text-gray-500">Used for verification only, not displayed publically.</p>
                <div className="mt-2">
                    <input
                        id="contact_email"
                        name="contact_email"
                        type="email"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-orange sm:text-sm sm:leading-6"
                    />
                </div>
                {state.errors?.contact_email && <p className="mt-2 text-sm text-red-600">{state.errors.contact_email[0]}</p>}
            </div>

            {state.errors?._form && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{state.errors._form[0]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex w-full justify-center rounded-md bg-brand-orange px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange disabled:opacity-50 transition-colors"
                >
                    {isPending ? <Loader2 className="animate-spin size-5" /> : 'Submit Business'}
                </button>
            </div>
        </form>
    );
}
