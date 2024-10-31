import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import DevProfileForm from '@/components/dashboard/profile/dev-profile-form';
import DevProfileView from '@/components/dashboard/profile/dev-profile-view';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Get user with profile
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Developer Profile</h1>
        </div>

        {user?.role === 'SENIOR_DEV' ? (
          user.dev_profile ? (
            <DevProfileView profile={user.dev_profile} reviews={user.reviews_received} />
          ) : (
            <DevProfileForm userId={user.id} />
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500 text-center">
              Only senior developers can create a profile.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}