import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface UserProfileProps {
  user: User;
  profile: any; // Type this properly based on your database schema
}

export default function UserProfile({ user, profile }: UserProfileProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
          {profile?.image_url ? (
            <Image
              src={profile.image_url}
              alt={profile?.name || user.email || ''}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-2xl text-gray-500">
                {(profile?.name || user.email || '').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <h2 className="text-xl font-medium mb-1">
          {profile?.name || 'Anonymous User'}
        </h2>
        <p className="text-gray-500 text-sm mb-4">{user.email}</p>
        
        <div className="w-full pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Role</h3>
          <p className="text-sm text-gray-500">
            {profile?.role === 'VIBECODER' ? 'Software Developer' : 'User'}
          </p>
        </div>
      </div>
    </div>
  );
}