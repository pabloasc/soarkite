import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import RequestList from '@/components/dashboard/request-list';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Get user with role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  // Get requests based on user role
  const requests = await prisma.helpRequest.findMany({
    where: user?.role === 'USER' 
      ? { user_id: session.user.id }
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
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Recent Requests</h1>
        </div>

        <RequestList 
          userId={session.user.id}
          userRole={user?.role || 'USER'}
          initialRequests={requests}
        />
      </main>
    </div>
  );
}