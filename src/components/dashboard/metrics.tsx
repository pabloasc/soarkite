import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Clock, MessageSquare, Star } from 'lucide-react';

interface DashboardMetricsProps {
  userId: string;
}

export default async function DashboardMetrics({ userId }: DashboardMetricsProps) {
  const supabase = createServerComponentClient({ cookies });
  
  // You can add real metrics queries here based on your database schema
  const metrics = [
    {
      label: 'Total Sessions',
      value: '0',
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      label: 'Messages',
      value: '0',
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      label: 'Rating',
      value: '0.0',
      icon: Star,
      color: 'text-yellow-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-medium mt-1">{metric.value}</p>
            </div>
            <metric.icon className={`h-8 w-8 ${metric.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}