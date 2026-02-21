'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleCallback() {
      try {
        const { supabase } = await import('@/lib/supabase/client');

        // Try getting existing session first
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          await ensureProfile(supabase, session.user.id, session.user.email!, session.user.user_metadata);
          router.replace('/feed');
          return;
        }

        // No session — try exchanging the PKCE code from URL params
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            router.replace('/login');
            return;
          }
          if (data.session?.user) {
            await ensureProfile(supabase, data.session.user.id, data.session.user.email!, data.session.user.user_metadata);
            router.replace('/feed');
            return;
          }
        }

        // No code and no session — something went wrong
        console.error('No auth code or session found');
        router.replace('/login');
      } catch (err) {
        console.error('Auth callback unexpected error:', err);
        router.replace('/login');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display italic text-3xl text-ink mb-2">Rifugio</h1>
        <p className="text-ink-muted text-sm">Signing you in...</p>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function ensureProfile(supabase: any, userId: string, email: string, metadata?: Record<string, unknown>) {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (existingProfile) return;

  const fullName =
    (metadata?.full_name as string) ||
    email.split('@')[0] ||
    'New Member';

  await supabase.from('profiles').insert({
    id: userId,
    email,
    full_name: fullName,
    role: 'member',
  });

  const { data: locations } = await supabase
    .from('locations')
    .select('id');

  if (locations && locations.length > 0) {
    const memberships = locations.map((loc: { id: string }, i: number) => ({
      profile_id: userId,
      location_id: loc.id,
      is_primary: i === 0,
    }));

    await supabase.from('member_locations').insert(memberships);
  }
}
