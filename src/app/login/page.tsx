'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login } from '@/app/auth/actions'
import { Loader2, ArrowRight, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        try {
            await login(formData)
            router.push('/dashboard')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Invalid email or password.')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-brand-cream p-4">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl border border-gray-100 reveal revealed">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-medium text-text-dark">Welcome Back</h1>
                    <p className="mt-3 text-gray-500">Manage your business profile and content.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
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

                    <div className="flex items-center justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-brand-orange hover:text-brand-red transition-colors"
                        >
                            Forgot password?
                        </Link>
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
                                Log In to Dashboard
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </button>

                    <div className="text-center text-sm text-gray-500">
                        Don't have a business account?{' '}
                        <Link
                            href="/signup"
                            className="font-bold text-brand-orange transition-colors hover:text-brand-red"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
