'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import RequestScreenshots from './request-screenshots';
import { useState } from 'react';
import ApplicationForm from './request-form/application-form';
import { UserRole, HelpRequest, User, RequestApplication } from '@prisma/client';

interface RequestListProps {
  userId: string;
  userRole: UserRole;
  initialRequests: (HelpRequest & {
    user: User;
    senior_dev: User | null;
    applications: Pick<RequestApplication, 'id' | 'developer_id' | 'status' | 'created_at'>[];
  })[];
}

export default function RequestList({ userId, userRole, initialRequests }: RequestListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const supabase = createClientComponentClient();

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

  if (!requests?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No help requests found.</p>
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

  const handleApplicationSubmit = async (requestId: string) => {
    // Refresh the requests list after application
    const updatedRequests = await fetch('/api/requests').then(res => res.json());
    if (updatedRequests) {
      setRequests(updatedRequests);
    }
    setSelectedRequestId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {requests.map((request) => {
        const hasApplied = request.applications?.some(
          (app) => app.developer_id === userId && app.status === 'PENDING'
        );
        const isAssigned = request.status !== 'PENDING';

        return (
          <div key={request.id} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{request.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
              </span>
            </div>

            <div className="mt-2 text-sm text-gray-500">
              <p>Tool: {request.tool}</p>
              <p>Created {formatDistanceToNow(new Date(request.created_at))} ago</p>
            </div>

            <div className="mt-4 text-sm">
              <p className="line-clamp-2 text-gray-600">{request.description}</p>
            </div>

            {request.screenshots?.length > 0 && (
              <div className="mt-4">
                <RequestScreenshots screenshots={request.screenshots} />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {request.user?.name || request.user?.email}
                  </p>
                  <p className="text-sm text-gray-500">Requester</p>
                </div>
              </div>

              {userRole === 'SENIOR_DEV' && (
                <div>
                  {!isAssigned && !hasApplied && (
                    <button
                      onClick={() => setSelectedRequestId(request.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Apply to Help
                    </button>
                  )}
                  {hasApplied && (
                    <span className="text-sm text-gray-500">Application Pending</span>
                  )}
                  {isAssigned && (
                    <span className="text-sm text-gray-500">Request Assigned</span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {selectedRequestId && (
        <ApplicationForm
          requestId={selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          onSubmit={() => handleApplicationSubmit(selectedRequestId)}
        />
      )}
    </div>
  );
}