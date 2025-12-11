import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen pt-32 pb-12 px-4 bg-brand-cream flex flex-col items-center justify-center text-center">
            <h2 className="font-serif text-6xl font-bold text-brand-orange mb-4">404</h2>
            <h1 className="font-serif text-3xl font-bold text-text-dark mb-6">Page Not Found</h1>
            <p className="text-gray-600 max-w-md mb-8">
                Oops! The page you are looking for has vanished or doesn't exist.
                It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-text-dark px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-orange transition-colors"
            >
                <ArrowLeft className="size-4" />
                Back to Home
            </Link>
        </div>
    )
}
