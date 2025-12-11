'use client'

import { useActionState } from 'react'
import { updateEvent } from '@/app/(admin)/admin/events/actions'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

// Quick type def since we don't have the full type here easily
type Event = {
    id: string
    title: string
    description_raw: string | null
    start_time: string
    end_time: string | null
    image_url: string | null
    ticket_url: string | null
    businesses: {
        id: string
        name: string
    } | null
}

const initialState = {
    message: '',
    errors: {}
}

function SubmitButton() {
    return (
        <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
            Save Changes
        </button>
    )
}

export function EditEventForm({ event }: { event: Event }) {
    const [state, formAction] = useActionState(updateEvent, initialState)

    return (
        <form action={formAction} className="space-y-6">
            <input type="hidden" name="id" value={event.id} />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Event Title
                    </label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            defaultValue={event.title}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="start_time" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Start Time
                    </label>
                    <div className="mt-2">
                        <input
                            type="datetime-local"
                            name="start_time"
                            id="start_time"
                            defaultValue={new Date(event.start_time).toISOString().slice(0, 16)}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="end_time" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        End Time (Optional)
                    </label>
                    <div className="mt-2">
                        <input
                            type="datetime-local"
                            name="end_time"
                            id="end_time"
                            defaultValue={event.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ''}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Description
                    </label>
                    <div className="mt-2">
                        <textarea
                            name="description"
                            id="description"
                            rows={4}
                            defaultValue={event.description_raw || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>
                <div className="col-span-2">
                    <label htmlFor="image_url" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-100">
                        Image URL
                    </label>
                    <div className="mt-2">
                        <input
                            type="url"
                            name="image_url"
                            id="image_url"
                            defaultValue={event.image_url || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-x-4">
                <Link
                    href="/admin/events"
                    className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100"
                >
                    Cancel
                </Link>
                <SubmitButton />
            </div>
            {state?.message && (
                <p className="text-sm text-red-600">{state.message}</p>
            )}
        </form>
    )
}
