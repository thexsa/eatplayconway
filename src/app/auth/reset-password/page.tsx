'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePassword } from '../password-actions'
import { Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const password = formData.get('password') as string
        const confirm = formData.get('confirm_password') as string

        if (password !== confirm) {
            setError("Passwords don't match")
            setIsLoading(false)
            return
        }

        try {
            await updatePassword(formData)
            router.push('/login?message=Password updated successfully')
        } catch (err: any) {
            setError(err.message || 'Something went wrong.')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-medium text-text-dark">Set New Password</h1>
                    <p className="mt-3 text-gray-500">Choose a secure password for your account.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-2">
                            <AlertCircle className="size-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="New Password"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-orange/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/10"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                name="confirm_password"
                                type="password"
                                required
                                placeholder="Confirm New Password"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-orange/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/10"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-orange py-4 text-sm font-bold text-white transition-all hover:bg-brand-red disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            <>
                                Update Password
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
