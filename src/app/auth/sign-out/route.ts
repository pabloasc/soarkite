import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/auth/server/server'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url));
}