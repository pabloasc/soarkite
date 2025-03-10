'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Code, ExternalLink } from 'lucide-react';


interface DevelopersListProps {
  developers: any[]; // Type this based on your User model with includes
}

export default function DevelopersList({ developers }: DevelopersListProps) {

  return (
    <div className="space-y-4">
      {developers.map((developer) => (
        <div 
          key={developer.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
        >
          <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            {/* Left section: Profile image and basic info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                  {developer.image_url ? (
                    <Image
                      src={developer.image_url}
                      alt={developer.name || 'Profile'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-gray-500 bg-gray-100">
                      {(developer.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-medium text-gray-700">
                    {developer.name || 'Anonymous Developer'}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-700 mb-1">
                  {developer.dev_profile?.title || 'Software Developer'}
                </p>
                
                {developer.country && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-700" />
                    <span>{developer.country}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Middle section: Bio */}
            <div className="md:flex-1 md:max-w-xl my-3 md:my-0">
              {developer.dev_profile?.bio && (
                <p className="text-gray-700 line-clamp-2">
                  {developer.dev_profile.bio}
                </p>
              )}
            </div>
            
            {/* Right section: Skills and action button */}
            <div className="flex flex-col md:items-end gap-3">
              {Array.isArray(developer.dev_profile?.skills) && developer.dev_profile?.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                  {developer.dev_profile.skills.slice(0, 3).map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {developer.dev_profile.skills.length > 3 && (
                    <span className="px-2 py-1 text-gray-700 text-xs">
                      +{developer.dev_profile.skills.length - 3} more
                    </span>
                  )}
                </div>
              )}
              
              <Link
                href={`/developers/${developer.id}`}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white transition-colors"
              >
                View Profile
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}