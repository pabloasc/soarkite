import { MessageSquare, HelpCircle, Star, Bell } from 'lucide-react';

interface DashboardMetricsProps {
  helpRequests: number;
  assignedRequests: number;
  averageRating: number | null;
  totalReviews: number;
  unreadMessages: number;
}

export default function DashboardMetrics({ 
  helpRequests,
  assignedRequests,
  averageRating,
  totalReviews,
  unreadMessages
}: DashboardMetricsProps) {
  const metrics = [
    {
      label: 'Help Requests',
      value: helpRequests.toString(),
      icon: HelpCircle,
      color: 'text-blue-500',
    },
    {
      label: 'Assigned Requests',
      value: assignedRequests.toString(),
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      label: 'Rating',
      value: averageRating ? `${averageRating.toFixed(1)} (${totalReviews})` : 'No reviews',
      icon: Star,
      color: 'text-yellow-500',
    },
    {
      label: 'Unread Messages',
      value: unreadMessages.toString(),
      icon: Bell,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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