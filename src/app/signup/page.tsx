'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/app/auth/actions'
import { Loader2, ArrowRight, User, Mail, Lock } from 'lucide-react'

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        try {
            await signup(formData)
            setIsSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream p-4 text-center">
                <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 reveal revealed">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Mail className="size-10" />
                    </div>
                    <h2 className="font-serif text-3xl font-medium text-text-dark">Check your email</h2>
                    <p className="text-gray-600">
                        We've sent a verification link to your email. Please click the link to finalize your business account setup.
                    </p>
                    <div className="pt-4">
                        <Link
                            href="/login"
                            className="text-brand-orange hover:text-brand-red font-medium transition-colors"
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
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 reveal revealed">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-medium text-text-dark">Grow Your Business</h1>
                    <p className="mt-3 text-gray-500">Create a business account to manage your presence on Eat Play Conway.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="FullName"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-orange/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/10"
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="Business Email"
                                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-orange/50 focus:bg-white focus:ring-4 focus:ring-brand-orange/10"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                            <input
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
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
                                Create Business Account
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
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
