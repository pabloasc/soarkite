import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

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
        role: body.role
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