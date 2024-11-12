import { redirect } from 'next/navigation';
import InboxContent from '@/components/dashboard/inbox/inbox-content';
import { getUserInfo } from '@/lib/auth/server/supabase';

export default async function InboxPage() {
  const user = await getUserInfo();

  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InboxContent user={user} />
    </div>
  );
}