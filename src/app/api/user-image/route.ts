import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase'
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const userInfo = getUserInfo();

    if (!userInfo) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const profile = await prisma.user.update({
      where: {
        id: body.id
      },
      data: {
        image_url: body.image_url,
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('User image update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}