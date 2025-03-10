import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getUserInfo } from '@/lib/auth/server/supabase';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export default async function Dashboard() {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect('/auth/sign-in');
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Help Requests</h1>
        </div>
      </main>
    </div>
  );
}