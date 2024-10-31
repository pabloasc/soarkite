import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import SettingsForm from '@/components/dashboard/settings-form';
import DashboardHeader from '@/components/dashboard/header';

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null;
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-normal mb-8">Settings</h1>
          <div className="bg-white rounded-lg shadow-sm">
            <SettingsForm user={session.user} profile={profile} />
          </div>
        </div>
      </main>
    </div>
  );
}