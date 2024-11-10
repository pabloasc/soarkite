import { NextResponse, NextRequest } from 'next/server';
import { createServerSupabaseClient as createClient } from '@/lib/auth/server/server';
import { PrismaClient } from '@prisma/client';
export const dynamic = "force-dynamic"


const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();

    const { data: { user }, error: authError }  = await supabase.auth.exchangeCodeForSession(code);

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

  // Ensure to remove query parameters that are no longer needed
  return NextResponse.redirect(new URL('/dashboard', request.url));
}