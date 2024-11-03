import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { HelpRequest, RequestApplication, DevReview, UserRole } from '@prisma/client';

interface RecentActivityProps {
  helpRequests: HelpRequest[];
  assignedRequests: HelpRequest[];
  applications: (RequestApplication & {
    request: HelpRequest;
  })[];
  reviews: (DevReview & {
    reviewer: {
      name: string | null;
      email: string;
    };
    request: HelpRequest;
  })[];
  userRole: UserRole;
}

export default function RecentActivity({ 
  helpRequests,
  assignedRequests,
  applications,
  reviews,
  userRole
}: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasActivity = helpRequests.length > 0 || 
    assignedRequests.length > 0 || 
    applications.length > 0 || 
    reviews.length > 0;

  if (!hasActivity) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No recent activity</p>
        {userRole === 'USER' && (
          <Link
            href="/dashboard/requests/new"
            className="inline-block mt-4 text-black hover:text-gray-800"
          >
            Create your first request
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {helpRequests.map((request) => (
        <div key={request.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Created a new help request</p>
              <h3 className="mt-1 text-lg font-medium">
                <Link href={`/dashboard/requests/${request.id}`} className="hover:text-gray-600">
                  {request.title}
                </Link>
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
              {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDistanceToNow(new Date(request.created_at))} ago
          </p>
        </div>
      ))}

      {assignedRequests.map((request) => (
        <div key={request.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Assigned to help request</p>
              <h3 className="mt-1 text-lg font-medium">
                <Link href={`/dashboard/requests/${request.id}`} className="hover:text-gray-600">
                  {request.title}
                </Link>
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
              {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDistanceToNow(new Date(request.created_at))} ago
          </p>
        </div>
      ))}

      {applications.map((application) => (
        <div key={application.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Applied to help request</p>
              <h3 className="mt-1 text-lg font-medium">
                <Link href={`/dashboard/requests/${application.request_id}`} className="hover:text-gray-600">
                  {application.request.title}
                </Link>
              </h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              application.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : application.status === 'ACCEPTED'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDistanceToNow(new Date(application.created_at))} ago
          </p>
        </div>
      ))}

      {reviews.map((review) => (
        <div key={review.id} className="p-6">
          <div>
            <p className="text-sm text-gray-500">
              Received a review from {review.reviewer.name || review.reviewer.email}
            </p>
            <h3 className="mt-1 text-lg font-medium">
              <Link href={`/dashboard/requests/${review.request_id}`} className="hover:text-gray-600">
                {review.request.title}
              </Link>
            </h3>
            <div className="mt-2 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {formatDistanceToNow(new Date(review.created_at))} ago
          </p>
        </div>
      ))}
    </div>
  );
}