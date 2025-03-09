import { NextResponse } from 'next/server';
import { createClient } from '@/lib/auth/server/server'
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', request.url));
}