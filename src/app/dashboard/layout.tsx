import { redirect } from 'next/navigation';
import { getUserInfo } from '@/lib/auth/server/supabase';
import Header from '@/components/shared/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      {children}
    </div>
  );
}