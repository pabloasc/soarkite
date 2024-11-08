'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import RequestScreenshots from './request-screenshots';
import ApplicationForm from './request-form/application-form';
import { createClient } from '@/lib/auth/client/client'

interface RequestDetailProps {
  request: any;
  currentUser: {
    id: string;
    role: string;
  };
}

export default function RequestDetail({ request, currentUser }: RequestDetailProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
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

  const hasApplied = request.applications?.some(
    (app: any) => app.developer.id === currentUser.id && app.status === 'PENDING'
  );

  const isAssigned = request.status !== 'PENDING';
  const isRequester = request.user.id === currentUser.id;
  const canApply = currentUser.role === 'SENIOR_DEV' && !isRequester && !isAssigned && !hasApplied;

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const messageId = crypto.randomUUID();
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          request_id: request.id,
          sender_id: currentUser.id,
          receiver_id: request.user.id,
          content: message,
          created_at: now
        });

      if (error) throw error;

      // Refresh the page to show the new message
      window.location.reload();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Request Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-medium">{request.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Created {formatDistanceToNow(new Date(request.created_at))} ago
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="mt-2 text-gray-600 whitespace-pre-line">{request.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700">Expected Outcome</h3>
              <p className="mt-2 text-gray-600">{request.expected_outcome}</p>
            </div>

            {request.screenshots?.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Screenshots</h3>
                <RequestScreenshots screenshots={request.screenshots} />
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Messages</h2>
          
          <div className="space-y-6">
            {request.messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">No messages yet</p>
              </div>
            ) : (
              request.messages.map((message: any) => (
                <div key={message.id} className="flex gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    {message.sender.image_url ? (
                      <Image
                        src={message.sender.image_url}
                        alt={message.sender.name || 'Profile'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg text-gray-400">
                          {(message.sender.name || message.sender.email || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">
                        {message.sender.name || message.sender.email}
                      </p>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at))} ago
                      </span>
                    </div>
                    <p className="mt-1 text-gray-600">{message.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {currentUser.role === 'SENIOR_DEV' && !isRequester && (
            <div className="mt-6 flex gap-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Requester Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Requester</h2>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden">
              {request.user.image_url ? (
                <Image
                  src={request.user.image_url}
                  alt={request.user.name || 'Profile'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xl text-gray-400">
                    {(request.user.name || request.user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium">{request.user.name || request.user.email}</p>
              <p className="text-sm text-gray-500">Project Owner</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canApply && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Apply to Help
            </button>
          </div>
        )}

        {/* Applications */}
        {(isRequester || currentUser.role === 'SENIOR_DEV') && request.applications.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Applications</h2>
            <div className="space-y-4">
              {request.applications.map((app: any) => (
                <div key={app.id} className="flex items-center gap-4">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    {app.developer.image_url ? (
                      <Image
                        src={app.developer.image_url}
                        alt={app.developer.name || 'Profile'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg text-gray-400">
                          {(app.developer.name || app.developer.email || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/dashboard/developers/${app.developer.id}`}
                      className="font-medium hover:text-gray-600"
                    >
                      {app.developer.name || app.developer.email}
                    </Link>
                    <p className="text-sm text-gray-500">
                      Applied {formatDistanceToNow(new Date(app.created_at))} ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showApplicationForm && (
        <ApplicationForm
          requestId={request.id}
          onClose={() => setShowApplicationForm(false)}
          onSubmit={() => window.location.reload()}
        />
      )}
    </div>
  );
}