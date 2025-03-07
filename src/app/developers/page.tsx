import DevelopersList from '@/components/dashboard/developers/developers-list';
import { PrismaClient } from '@prisma/client';
import { getUserInfo } from '@/lib/auth/server/supabase';
import Link from 'next/link';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export default async function PublicDevelopers() {
  const user = await getUserInfo();

  // Get all developers with their profiles and reviews
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
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Software Developers</h1>
          {user && (
            <Link 
              href="/dashboard" 
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <DevelopersList developers={developers} />
      </main>
    </div>
  );
}
