'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '../auth/password-actions'
import { Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        try {
            await forgotPassword(formData)
            setIsSent(true)
        } catch (err: any) {
            setError(err.message || 'Something went wrong.')
            setIsLoading(false)
        }
    }

    if (isSent) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-4 text-center">
                <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-500">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="size-10" />
                    </div>
                    <h2 className="font-serif text-3xl font-medium text-text-dark">Email Sent</h2>
                    <p className="text-gray-600">
                        If an account exists for that email, we've sent instructions to reset your password.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/login"
                            className="text-brand-orange hover:text-brand-red font-bold transition-colors"
                        >
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-medium text-text-dark">Forgot Password?</h1>
                    <p className="mt-3 text-gray-500">No worries, we'll send you reset instructions.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Your account email"
                            className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-orange/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/10"
                        />
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
                                Send Reset Link
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Remembered it?{' '}
                        <Link
                            href="/login"
                            className="font-bold text-brand-orange transition-colors hover:text-brand-red"
                        >
                            Log in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
