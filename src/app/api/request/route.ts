import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/auth/server/supabase'

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const sessionUser = await getSession();

    if (!sessionUser) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { role: true }
    });

    // Get requests based on user role
    const requests = await prisma.helpRequest.findMany({
      where: user?.role === 'USER' 
        ? { user_id: sessionUser.id }
        : undefined,
      include: {
        user: true,
        senior_dev: true,
        applications: {
          select: {
            id: true,
            developer_id: true,
            status: true,
            created_at: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}