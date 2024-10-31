import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface RecentActivityProps {
  userId: string;
}

export default async function RecentActivity({ userId }: RecentActivityProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // Add real activity queries here based on your database schema
  const activities = [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium mb-6">Recent Activity</h2>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity: any) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
            >
              {/* Add activity content here */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
}