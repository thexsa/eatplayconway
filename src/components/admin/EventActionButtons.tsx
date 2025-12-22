'use client'

import { Check, X, ArchiveX } from 'lucide-react'
import { approveEvent, rejectEvent, unpublishEvent } from '@/app/(admin)/admin/events/actions'
import { useState } from 'react'

interface EventActionButtonsProps {
    eventId: string
    isPublished?: boolean
}

export function EventActionButtons({ eventId, isPublished = false }: EventActionButtonsProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            await approveEvent(eventId)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject/archive this event?')) return

        setIsLoading(true)
        try {
            await rejectEvent(eventId)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUnpublish = async () => {
        if (!confirm('Are you sure you want to unpublish this event? It will move back to draft.')) return

        setIsLoading(true)
        try {
            await unpublishEvent(eventId)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="text-xs text-gray-400">...</div>
    }

    if (isPublished) {
        return (
            <button
                onClick={handleUnpublish}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Unpublish"
            >
                <ArchiveX className="size-4" />
            </button>
        )
    }

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={handleApprove}
                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                title="Approve"
            >
                <Check className="size-4" />
            </button>
            <button
                onClick={handleReject}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Reject"
            >
                <X className="size-4" />
            </button>
        </div>
    )
}
