'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Send, Loader2, AlertCircle } from 'lucide-react';

export default function TicketReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send reply.');
        setSubmitting(false);
        return;
      }

      setMessage('');
      setSubmitting(false);
      router.refresh();
    } catch (err) {
      setError('An error occurred.');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <div className="flex-1 relative">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your reply here..."
          className="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-6 py-3.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow pr-16"
        />
        {error && (
          <div className="absolute -top-10 left-0 bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-lg flex items-center shadow-sm border border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
      </div>
      <button 
        type="submit" 
        disabled={!message.trim() || submitting}
        className="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 -ml-1 mt-0.5" />}
      </button>
    </form>
  );
}
