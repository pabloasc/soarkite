'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import DashboardHeader from '@/components/dashboard/header';
import { MessageSquare, User, Clock } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/auth/client/client'


export default function Inbox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(id, name, email),
          request:request_id(id, title)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(messages || []);
      setLoading(false);
    };

    fetchMessages();
  }, [supabase]);

  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      return;
    }

    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={null} />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-normal">Inbox</h1>
          <div className="text-sm text-gray-500">
            {messages.filter(m => !m.read).length} unread messages
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-lg shadow-sm p-6 ${
                  !message.read ? 'border-l-4 border-black' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="bg-gray-100 rounded-full p-2">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {message.sender.name || message.sender.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Re: {message.request.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(message.created_at))} ago
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">{message.content}</p>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <Link
                    href={`/dashboard/requests/${message.request_id}`}
                    className="text-sm text-black hover:text-gray-700"
                  >
                    View Request
                  </Link>
                  {!message.read && (
                    <button
                      onClick={() => markAsRead(message.id)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}