'use client'

import { useFormStatus } from 'react-dom'
import { addSource } from '@/app/(admin)/admin/sources/actions'
import { useActionState } from 'react'

const initialState = {
    message: '',
    errors: undefined,
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <button
            type="submit"
            aria-disabled={pending}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
            {pending ? 'Saving...' : 'Save Source'}
        </button>
    )
}

export function AddSourceForm() {
    const [state, formAction] = useActionState(addSource, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                    Source Name
                </label>
                <div className="mt-2">
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        placeholder="e.g. Local News RSS"
                    />
                </div>
                {state?.errors?.name && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="url" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                    Source URL
                </label>
                <div className="mt-2">
                    <input
                        id="url"
                        name="url"
                        type="url"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        placeholder="https://example.com/feed.xml"
                    />
                </div>
                {state?.errors?.url && (
                    <p className="mt-2 text-sm text-red-600">{state.errors.url}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Type
                    </label>
                    <div className="mt-2">
                        <select
                            id="type"
                            name="type"
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        >
                            <option value="website_rss">RSS Feed</option>
                            <option value="website_html">Website (AI Scraper)</option>
                            <option value="facebook_page">Facebook Page</option>
                            <option value="instagram">Instagram</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Frequency (Hours)
                    </label>
                    <div className="mt-2">
                        <input
                            id="frequency"
                            name="frequency"
                            type="number"
                            defaultValue={24}
                            min={1}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-x-6">
                <SubmitButton />
            </div>

            {state?.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}
        </form>
    )
}
