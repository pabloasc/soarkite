'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import FileUpload from '@/components/dashboard/request-form/file-upload';
import { createClient } from '@/lib/auth/client/client'
export const dynamic = "force-dynamic"

type UploadedFile = {
  name: string;
  url: string;
};

export default function NewRequest() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [user, setUser] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    tool: '',
    description: '',
    expectedOutcome: '',
    urgency: 'NORMAL',
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/sign-in');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [supabase, router]);

  const handleFilesUploaded = (newFiles: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileRemove = (fileUrl: string) => {
    setUploadedFiles(prev => prev.filter(file => file.url !== fileUrl));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('User not authenticated');

      // First, check if the user exists in the users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      if (userError) {
        // If user doesn't exist, create them first
        const { error: createUserError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || null,
            role: 'USER'
          });

        if (createUserError) throw createUserError;
      }

      const now = new Date().toISOString();

      // Now create the help request
      const { error: insertError } = await supabase
        .from('help_requests')
        .insert({
          id: crypto.randomUUID(),
          user_id: user.id,
          title: formData.title,
          tool: formData.tool,
          description: formData.description,
          expected_outcome: formData.expectedOutcome,
          urgency: formData.urgency,
          screenshots: uploadedFiles.map(file => file.url),
          created_at: now,
          updated_at: now
        });

      if (insertError) throw insertError;

      router.push('/dashboard/requests');
      router.refresh();
    } catch (error: any) {
      console.error('Error creating request:', error);
      setError(error.message || 'Failed to create request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-normal mb-6">Create Help Request</h1>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label htmlFor="tool" className="block text-sm font-medium text-gray-700 mb-1">
                  AI Tool
                </label>
                <select
                  id="tool"
                  required
                  value={formData.tool}
                  onChange={(e) => setFormData({ ...formData, tool: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Select AI Tool</option>
                  <option value="github-copilot">GitHub Copilot</option>
                  <option value="cursor-ide">Cursor IDE</option>
                  <option value="v0">V0 (Vercel)</option>
                  <option value="bolt-new">bolt.new</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Describe what you're trying to achieve and what problems you're encountering"
                />
              </div>

              <div>
                <label htmlFor="expectedOutcome" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Outcome
                </label>
                <textarea
                  id="expectedOutcome"
                  required
                  rows={2}
                  value={formData.expectedOutcome}
                  onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="What result are you looking for?"
                />
              </div>

              <div>
                <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <select
                  id="urgency"
                  required
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="LOW">Low - Within a few days</option>
                  <option value="NORMAL">Normal - Within 24 hours</option>
                  <option value="HIGH">High - Within a few hours</option>
                  <option value="URGENT">Urgent - As soon as possible</option>
                </select>
              </div>

              <FileUpload
                onFilesUploaded={handleFilesUploaded}
                uploadedFiles={uploadedFiles}
                onFileRemove={handleFileRemove}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Creating Request...
                    </>
                  ) : (
                    'Create Request'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}