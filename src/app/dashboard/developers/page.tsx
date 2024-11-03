import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import DevelopersList from '@/components/dashboard/developers/developers-list';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Developers() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Get all senior developers with their profiles and reviews
  const developers = await prisma.user.findMany({
    where: {
      role: 'SENIOR_DEV',
      dev_profile: {
        isNot: null
      }
    },
    include: {
      dev_profile: true,
      reviews_received: {
        include: {
          reviewer: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 3
      }
    },
    orderBy: {
      dev_profile: {
        average_rating: 'desc'
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Senior Developers</h1>
        </div>

        <DevelopersList developers={developers} />
      </main>
    </div>
  );
}