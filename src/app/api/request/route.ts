import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase'
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userInfo = await getUserInfo();

    if (!userInfo) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user role
    const user = await prisma.user.findUnique({
      where: { id: userInfo.id },
      select: { role: true }
    });

    // Get requests based on user role
    const requests = await prisma.helpRequest.findMany({
      where: user?.role === 'USER' 
        ? { user_id: userInfo.id }
        : undefined,
      include: {
        user: true,
        vibecoder: true,
        applications: {
          select: {
            id: true,
            developer_id: true,
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