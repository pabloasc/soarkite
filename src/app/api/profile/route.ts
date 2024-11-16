import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase'
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const userInfo = await getUserInfo();

    if (!userInfo) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const profile = await prisma.devProfile.create({
      data: {
        user_id: body.userId,
        title: body.title,
        experience_level: body.experienceLevel,
        years_of_experience: body.yearsOfExperience,
        bio: body.bio,
        timezone: body.timezone,
        hourly_rate: body.hourlyRate,
        github_url: body.githubUrl,
        linkedin_url: body.linkedinUrl,
        portfolio_url: body.portfolioUrl,
        skills: body.skills,
        ai_tools_experience: body.aiToolsExperience,
        specializations: body.specializations,
        languages: body.languages,
        availability: body.availability,
        certifications: body.certifications,
        company: body.company
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userInfo = getUserInfo();

    if (!userInfo) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    const profile = await prisma.devProfile.update({
      where: {
        user_id: body.userId
      },
      data: {
        title: body.title,
        experience_level: body.experienceLevel,
        years_of_experience: body.yearsOfExperience,
        bio: body.bio,
        timezone: body.timezone,
        hourly_rate: body.hourlyRate,
        github_url: body.githubUrl,
        linkedin_url: body.linkedinUrl,
        portfolio_url: body.portfolioUrl,
        skills: body.skills,
        ai_tools_experience: body.aiToolsExperience,
        specializations: body.specializations,
        languages: body.languages,
        availability: body.availability,
        certifications: body.certifications,
        company: body.company
      }
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile update error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}