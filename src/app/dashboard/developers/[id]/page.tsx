import { redirect, notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import DashboardHeader from '@/components/dashboard/header';
import DevProfileView from '@/components/dashboard/profile/dev-profile-view';
import { getUserInfo } from '@/lib/auth/server/supabase';


const prisma = new PrismaClient();

interface Props {
  params: {
    id: string;
  };
}

export default async function DeveloperProfile({ params }: Props) {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get developer with profile and reviews
  const developer = await prisma.user.findUnique({
    where: {
      id: params.id,
      role: 'SENIOR_DEV'
    },
    include: {
      dev_profile: true,
      reviews_received: {
        include: {
          reviewer: true,
          request: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 5
      }
    }
  });

  if (!developer || !developer.dev_profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Developer Profile</h1>
        </div>

        <DevProfileView 
          profile={developer.dev_profile}
          user={developer}
          reviews={developer.reviews_received}
          isOwnProfile={false}
        />
      </main>
    </div>
  );
}