import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="text-gray-500">Loading...</span>
      </div>
    </div>
  );
}