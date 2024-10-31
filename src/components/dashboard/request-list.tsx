import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import RequestScreenshots from './request-screenshots';

interface RequestListProps {
  userId: string;
}

export default async function RequestList({ userId }: RequestListProps) {
  const supabase = createServerComponentClient({ cookies });

  const { data: requests } = await supabase
    .from('help_requests')
    .select(`
      *,
      user:users!help_requests_user_id_fkey(
        name,
        email
      ),
      senior_dev:users!help_requests_senior_dev_id_fkey(
        name,
        email
      )
    `)
    .order('created_at', { ascending: false });

  if (!requests?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No help requests yet.</p>
        <Link
          href="/dashboard/requests/new"
          className="inline-block mt-4 text-black hover:text-gray-800"
        >
          Create your first request
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
      {requests.map((request) => (
        <div key={request.id} className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{request.title}</h3>
            <span className={`
              px-3 py-1 rounded-full text-sm
              ${request.status === 'PENDING' && 'bg-yellow-100 text-yellow-800'}
              ${request.status === 'ASSIGNED' && 'bg-blue-100 text-blue-800'}
              ${request.status === 'IN_PROGRESS' && 'bg-purple-100 text-purple-800'}
              ${request.status === 'COMPLETED' && 'bg-green-100 text-green-800'}
              ${request.status === 'CANCELLED' && 'bg-gray-100 text-gray-800'}
            `}>
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
                  {request.user.name || request.user.email}
                </p>
                <p className="text-sm text-gray-500">Requester</p>
              </div>
            </div>

            {request.senior_dev && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {request.senior_dev.name || request.senior_dev.email}
                </p>
                <p className="text-sm text-gray-500">Senior Developer</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}