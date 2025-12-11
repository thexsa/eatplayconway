import { createClient } from '@/utils/supabase/server';
import { approveBusiness, rejectBusiness } from './actions';
import { Check, X, Globe, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default async function BusinessQueuePage() {
    const supabase = await createClient();

    const { data: businesses } = await supabase
        .from('businesses')
        .select('*')
        .eq('is_verified', false)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl font-bold tracking-tight text-text-dark">Business Applications</h1>
                    <p className="text-gray-500">Review {businesses?.length || 0} pending business submissions.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {businesses?.map((business) => (
                    <div key={business.id} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-text-dark">{business.name}</h3>
                                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                    {business.category}
                                </span>
                                <span className="text-xs text-gray-400">
                                    Submitted {formatDistanceToNow(new Date(business.created_at))} ago
                                </span>
                            </div>

                            <p className="text-gray-600">{business.description || 'No description provided.'}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Address:</span> {business.address}
                                </div>
                                {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (business.social_links as any)?.contact_email && (
                                        <div className="flex items-center gap-1">
                                            <Mail className="size-3" />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {(business.social_links as any).contact_email}
                                        </div>
                                    )
                                }
                                {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    (business.social_links as any)?.website && (
                                        <div className="flex items-center gap-1 hover:text-brand-orange">
                                            <Globe className="size-3" />
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <a href={(business.social_links as any).website} target="_blank" rel="noopener noreferrer">Website</a>
                                        </div>
                                    )
                                }
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:self-center">
                            <form action={approveBusiness.bind(null, business.id)}>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-200 transition-colors"
                                >
                                    <Check className="size-4" /> Approve
                                </button>
                            </form>
                            <form action={rejectBusiness.bind(null, business.id)}>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
                                    onClick={() => !confirm('Are you sure you want to reject (delete) this submission?') && event?.preventDefault()}
                                >
                                    <X className="size-4" /> Reject
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!businesses || businesses.length === 0) && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 border-dashed">
                        <p className="text-gray-500">No pending business applications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
