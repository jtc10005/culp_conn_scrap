import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = getSupabaseClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect to bulletin board after successful auth
  return NextResponse.redirect(new URL('/bulletin-board', requestUrl.origin));
}
