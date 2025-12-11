'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BusinessSubmissionForm from '@/components/forms/BusinessSubmissionForm';

export default function SubmitPage() {
    return (
        <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-orange mb-4 transition-colors">
                        <ArrowLeft className="mr-2 size-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-serif font-bold text-text-dark mb-4">List Your Business</h1>
                    <p className="text-lg text-gray-600">
                        Join the EatPlayConway directory for free. help locals and visitors find you.
                        All submissions are reviewed by our team before going live.
                    </p>
                </div>

                <BusinessSubmissionForm />
            </div>
        </main>
    );
}
