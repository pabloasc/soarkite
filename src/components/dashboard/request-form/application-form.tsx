'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ApplicationFormProps {
  requestId: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApplicationForm({ requestId, onClose, onSubmit }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({
    message: '',
    rate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get the request details first to get the user_id
      const { data: request, error: requestError } = await supabase
        .from('help_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      const now = new Date().toISOString();

      // Create the application with a generated UUID
      const applicationId = crypto.randomUUID();
      const { error: applicationError } = await supabase
        .from('request_applications')
        .insert({
          id: applicationId,
          request_id: requestId,
          developer_id: user.id,
          message: formData.message,
          rate: formData.rate ? parseFloat(formData.rate) : null,
          status: 'PENDING',
          created_at: now,
          updated_at: now
        });

      if (applicationError) throw applicationError;

      // Create initial message with a generated UUID
      const messageId = crypto.randomUUID();
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          request_id: requestId,
          sender_id: user.id,
          receiver_id: request.user_id,
          content: formData.message,
          created_at: now
        });

      if (messageError) throw messageError;

      onSubmit();
    } catch (error: any) {
      console.error('Application error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">Apply to Help</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message to Requester
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Introduce yourself and explain how you can help..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hourly Rate (Optional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                className="w-full pl-7 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Applying...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}