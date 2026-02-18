'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // In demo mode, just redirect to feed
    if (isDemoMode) {
      router.push('/feed');
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Verification failed');
        setLoading(false);
        return;
      }

      // Member verified — send magic link via Supabase
      const { supabase } = await import('@/lib/supabase/client');

      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.name || email.split('@')[0],
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface-elevated rounded-2xl shadow-lg p-8">
        {/* Logo and tagline */}
        <div className="text-center mb-8">
          <h1 className="font-display italic text-4xl text-ink mb-2">
            Rifugio
          </h1>
          <p className="text-ink-muted font-body text-sm">
            Your basecamp awaits
          </p>
        </div>

        {success ? (
          // Success state
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-600 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-display text-ink mb-2">
              Check your email
            </h2>
            <p className="text-ink-muted font-body text-sm">
              We've sent a login link to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          // Login form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-body text-ink mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border-subtle text-ink font-body placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-ink/20"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-body mb-2">{error}</p>
                <a
                  href="https://rifugio.kceadventures.com"
                  className="text-sm text-red-600 hover:text-red-700 font-body underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Rifugio
                </a>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Continue'}
            </Button>

            {isDemoMode && (
              <p className="text-xs text-ink-muted text-center font-body">
                Demo mode - Click to explore
              </p>
            )}
          </form>
        )}

        {!success && (
          <div className="mt-6 text-center">
            <p className="text-sm text-ink-muted font-body">
              Not a member?{' '}
              <a
                href="https://rifugio.kceadventures.com"
                className="text-ink hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Rifugio
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
