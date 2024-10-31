import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (!authError && user) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existingUser) {
          // Create new user in database
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              name: user.user_metadata.name || null,
              role: (user.user_metadata.role as 'USER' | 'SENIOR_DEV') || 'USER'
            },
          });
        }
      } catch (error) {
        console.error('Error creating user:', error);
      } finally {
        await prisma.$disconnect();
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}