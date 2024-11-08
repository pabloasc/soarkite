import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import RequestList from '@/components/dashboard/request-list';
import { getSession } from '@/lib/auth/server/supabase';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const user = await getSession();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user with role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  // Get requests based on user role
  const requests = await prisma.helpRequest.findMany({
    where: dbUser?.role === 'USER' 
      ? { user_id: user.id }
      : undefined,
    include: {
      user: true,
      senior_dev: true,
      applications: {
        select: {
          id: true,
          developer_id: true,
          status: true,
          created_at: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    },
    take: 5
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Help Requests</h1>
        </div>

        <RequestList 
          userId={user.id}
          userRole={dbUser?.role || 'USER'}
          initialRequests={requests}
        />
      </main>
    </div>
  );
}