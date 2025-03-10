import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import SettingsForm from '@/components/dashboard/settings-form';
import { getUserInfo } from '@/lib/auth/server/supabase';
export const dynamic = "force-dynamic"

const prisma = new PrismaClient();

export default async function Settings() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  // Get user with all related data
  const userDB = await prisma.user.findUnique({
    where: { id: user.id }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium p-6 border-b">Account Settings</h2>
              <SettingsForm user={user} profile={userDB} />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium p-6 border-b">Recent Activity</h2>
              <div className="p-6">
                <p>No activity yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}