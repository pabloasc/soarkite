import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/header';
import UserProfile from '@/components/dashboard/user-profile';
import DashboardMetrics from '@/components/dashboard/metrics';
import RecentActivity from '@/components/dashboard/recent-activity';

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <UserProfile user={session.user} profile={profile} />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <DashboardMetrics userId={session.user.id} />
            <RecentActivity userId={session.user.id} />
          </div>
        </div>
      </main>
    </div>
  );
}