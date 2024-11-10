import { redirect, notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import DashboardHeader from '@/components/dashboard/header';
import RequestDetail from '@/components/dashboard/request-detail';
import { getUserInfo } from '@/lib/auth/server/supabase';

const prisma = new PrismaClient();

interface Props {
  params: {
    id: string;
  };
}

export default async function RequestPage({ params }: Props) {
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
    where: { id: params.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image_url: true
        }
      },
      senior_dev: {
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
      <DashboardHeader user={user} />
      
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