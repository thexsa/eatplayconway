'use client'

import { Check, X } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { approveEvent, rejectEvent } from '@/app/(admin)/admin/events/actions'

function SubmitButton({ icon: Icon, label }: { icon: any, label: string }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className={`p-1 text-zinc-400 disabled:opacity-50 ${label === 'Approve' ? 'hover:text-green-500' : 'hover:text-red-500'}`}
            title={label}
        >
            {pending ? (
                <span className="size-4 block border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
                <Icon className="size-4" />
            )}
        </button>
    )
}

export function EventActionButtons({ eventId }: { eventId: string }) {
    return (
        <>
            <form action={approveEvent.bind(null, eventId)}>
                <SubmitButton icon={Check} label="Approve" />
            </form>
            <form action={rejectEvent.bind(null, eventId)}>
                <SubmitButton icon={X} label="Reject" />
            </form>
        </>
    )
}
