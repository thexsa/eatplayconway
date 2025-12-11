'use client'

import { approveAllPending } from '@/app/(admin)/admin/events/actions'
import { CheckCheck, Loader2 } from 'lucide-react'
import { useTransition } from 'react'

export function BulkApproveButton() {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            onClick={() => {
                if (confirm('Are you sure you want to approve ALL pending events?')) {
                    startTransition(async () => {
                        await approveAllPending()
                    })
                }
            }}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 transition-colors"
        >
            {isPending ? (
                <Loader2 className="animate-spin size-4" />
            ) : (
                <CheckCheck className="size-4" />
            )}
            Approve All
        </button>
    )
}
