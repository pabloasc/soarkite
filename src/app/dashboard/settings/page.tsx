import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import DashboardHeader from '@/components/dashboard/header';
import SettingsForm from '@/components/dashboard/settings-form';
import DashboardMetrics from '@/components/dashboard/metrics';
import RecentActivity from '@/components/dashboard/recent-activity';

const prisma = new PrismaClient();

export default async function Settings() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Get user with all related data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      help_requests: {
        orderBy: { created_at: 'desc' },
        take: 3
      },
      assigned_requests: {
        orderBy: { created_at: 'desc' },
        take: 3
      },
      reviews_received: {
        include: {
          reviewer: true,
          request: true
        },
        orderBy: { created_at: 'desc' },
        take: 3
      },
      sent_applications: {
        include: {
          request: true
        },
        orderBy: { created_at: 'desc' },
        take: 3
      }
    }
  });

  // Get metrics
  const metrics = await prisma.$transaction([
    prisma.helpRequest.count({
      where: { user_id: session.user.id }
    }),
    prisma.helpRequest.count({
      where: { senior_dev_id: session.user.id }
    }),
    prisma.devReview.aggregate({
      where: { developer_id: session.user.id },
      _avg: { rating: true },
      _count: { rating: true }
    }),
    prisma.message.count({
      where: {
        receiver_id: session.user.id,
        read: false
      }
    })
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={session.user} />
      
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium p-6 border-b">Account Settings</h2>
              <SettingsForm user={session.user} profile={user} />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <DashboardMetrics 
              helpRequests={metrics[0]}
              assignedRequests={metrics[1]}
              averageRating={metrics[2]._avg.rating}
              totalReviews={metrics[2]._count.rating}
              unreadMessages={metrics[3]}
            />
            
            <div className="bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-medium p-6 border-b">Recent Activity</h2>
              <RecentActivity 
                helpRequests={user?.help_requests || []}
                assignedRequests={user?.assigned_requests || []}
                applications={user?.sent_applications || []}
                reviews={user?.reviews_received || []}
                userRole={user?.role || 'USER'}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}