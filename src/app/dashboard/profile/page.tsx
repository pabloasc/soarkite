import { redirect } from 'next/navigation';
import DevProfileForm from '@/components/dashboard/profile/dev-profile-form';
import DevProfileView from '@/components/dashboard/profile/dev-profile-view';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export default async function Profile() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user with profile
  const userDB = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      dev_profile: true,
      reviews_received: {
        include: {
          reviewer: true
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
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Developer Profile</h1>
        </div>

        {userDB?.role === 'VIBECODER' ? (
          userDB.dev_profile ? (
            <DevProfileView developer={userDB} isAdmin={true} isLoggedIn={!!user}/>
          ) : (
            <DevProfileForm userId={userDB.id} />
          )
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-500 text-center">
              Only software developers can create a profile.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}