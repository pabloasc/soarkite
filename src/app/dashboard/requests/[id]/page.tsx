import { redirect, notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import RequestDetail from '@/components/dashboard/request-detail';
import { getUserInfo } from '@/lib/auth/server/supabase';
import type { NextPage, GetServerSideProps } from 'next';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

type Props = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function RequestPage({ params, searchParams }: Props) {
  const { id } = await params;
  const searchParamsData = await searchParams;
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user role
  const userDB = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  // Get request with all related data
  const request = await prisma.helpRequest.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image_url: true
        }
      },
      vibecoder: {
        select: {
          id: true,
          name: true,
          email: true,
          image_url: true,
          dev_profile: true
        }
      },
      applications: {
        include: {
          developer: {
            select: {
              id: true,
              name: true,
              email: true,
              image_url: true,
              dev_profile: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      },
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              image_url: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      }
    }
  });

  if (!request) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <RequestDetail 
          request={request}
          currentUser={{
            id: user.id,
            role: userDB?.role || 'USER'
          }}
        />
      </main>
    </div>
  );
}