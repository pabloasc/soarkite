import { NextResponse, NextRequest } from 'next/server';
import { createClient } from '@/lib/auth/server/server';
import { PrismaClient } from '@prisma/client';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const timezone = searchParams.get('timezone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (code) {
    const supabase = await createClient();

    const { data: { user }, error: authError }  = await supabase.auth.exchangeCodeForSession(code);

    if (!authError && user) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!existingUser) {
          // Get role from user metadata
          const role = user.user_metadata?.role || 'USER';

          // Create new user in database with timezone
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email!,
              name: user.user_metadata.name || null,
              role: role,
              timezone: timezone
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