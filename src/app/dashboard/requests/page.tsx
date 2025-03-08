import Link from 'next/link';
import { redirect } from 'next/navigation';
import RequestList from '@/components/dashboard/request-list';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export default async function Requests() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user with role
  const userDB = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  // Get requests based on user role
  const requests = await prisma.helpRequest.findMany({
    where: user?.role === 'USER' 
      ? { user_id: user.id }
      : undefined,
    include: {
      user: true,
      vibecoder: true,
      applications: {
        select: {
          id: true,
          developer_id: true,
          created_at: true
        }
      }
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Help Requests</h1>
          {(userDB?.role && userDB.role === 'USER') && (
            <Link
              href="/dashboard/requests/new"
              className="inline-flex px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Create Request
            </Link>
          )}
        </div>

        <RequestList 
          userId={user.id}
          userRole={userDB?.role || 'USER'}
          initialRequests={requests}
        />
      </main>
    </div>
  );
}