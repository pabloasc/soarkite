import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase'
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Create user in database
    const user = await prisma.user.create({
      data: {
        id: body.id,
        email: body.email,
        name: body.name,
        role: body.role,
        timezone: body.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}

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
        name: body.name,
        role: body.role,
        timezone: body.timezone,
        email_notifications: body.emailNotifications,
        theme: body.theme,
        language: body.language
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('User update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}