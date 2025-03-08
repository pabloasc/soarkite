'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import RequestScreenshots from './request-screenshots';
import { useState } from 'react';
import ApplicationForm from './request-form/application-form';
import { UserRole, HelpRequest, User, RequestApplication } from '@prisma/client';
import { BadgeHelp, Clock, AlertCircle, MessageSquare, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/auth/client/client'

interface RequestListProps {
  userId: string;
  userRole: UserRole;
  initialRequests: (HelpRequest & {
    user: User;
    vibecoder: User | null;
    applications: Pick<RequestApplication, 'id' | 'developer_id' | 'status' | 'created_at'>[];
  })[];
}

export default function RequestList({ userId, userRole, initialRequests }: RequestListProps) {
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const supabase = createClient();

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'LOW':
        return 'text-green-600';
      case 'NORMAL':
        return 'text-blue-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'URGENT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
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
    <div className="space-y-6">
      {requests.map((request) => {
        const hasApplied = request.applications?.some(
          (app) => app.developer_id === userId && app.status === 'PENDING'
        );
        const isAssigned = request.status !== 'PENDING';

        return (
          <div key={request.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                    </span>
                    <span className={`flex items-center gap-1 text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      {request.urgency.charAt(0) + request.urgency.slice(1).toLowerCase()} Priority
                    </span>
                  </div>
                  <Link 
                    href={`/dashboard/requests/${request.id}`}
                    className="group flex items-center gap-2"
                  >
                    <h3 className="text-xl font-medium group-hover:text-gray-600 transition-colors">
                      {request.title}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </Link>
                </div>
                {userRole === 'VIBECODER' && request.user_id !== userId && (
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

            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <BadgeHelp className="h-4 w-4" />
                  <span>{request.tool}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Created {formatDistanceToNow(new Date(request.created_at))} ago</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{request.applications.length} Applications</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 line-clamp-2">{request.description}</p>

              {request.screenshots?.length > 0 && (
                <div className="mt-4">
                  <RequestScreenshots screenshots={request.screenshots} />
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {(request.user?.name || request.user?.email || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {request.user?.name || request.user?.email}
                    </p>
                    <p className="text-xs text-gray-500">Project Owner</p>
                  </div>
                </div>
              </div>
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