'use client';

import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, DollarSign, Github, Linkedin, Globe, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DevProfileForm from './dev-profile-form';

interface DevProfileViewProps {
  developer: any; // Type this based on your User model with includes
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

export default function DevProfileView({ developer, isAdmin = false, isLoggedIn = false }: DevProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const profile = developer.dev_profile;
  const user = developer;
  const isOwnProfile = isLoggedIn && isAdmin;


  if (isEditing && isOwnProfile) {
    return (
      <DevProfileForm
        userId={profile.user_id}
        existingProfile={profile}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Profile Information */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-medium">{user.name || 'Software Developer'}</h1>
            
            {isLoggedIn && isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            )}
          </div>

          <div className="flex items-start gap-6 mb-6">
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {user?.image_url ? (
                  <Image
                    src={user.image_url}
                    alt={user?.name || 'Profile'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                    {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-medium">{profile.title}</h2>
                  <p className="text-gray-600 mt-1">
                    {profile.experience_level.charAt(0) + profile.experience_level.slice(1).toLowerCase()} Developer
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {user?.country && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{user.country}</span>
              </div>
            )}
            {profile.hourly_rate && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>${profile.hourly_rate}/hour</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">About</h3>
            <p className="text-gray-600 whitespace-pre-line">{profile.bio}</p>
          </div>

          {profile.ai_tools_experience?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">AI Tools Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.ai_tools_experience.map((tool: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium">{tool.tool}</h4>
                    <p className="text-sm text-gray-600">
                      {tool.expertise_level} expertise
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications */}
        {profile.certifications?.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Certifications</h3>
            <div className="space-y-4">
              {profile.certifications.map((cert: any, index: number) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                  </div>
                  <span className="text-sm text-gray-500">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-8">
        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-1 text-2xl font-medium">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              {profile.average_rating.toFixed(1)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {profile.total_reviews} reviews
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-medium">{profile.total_sessions}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-medium">{profile.years_of_experience}</div>
              <div className="text-sm text-gray-600">Years Exp.</div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {profile.github_url && (
              <Link
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Github className="h-5 w-5" />
                <span>GitHub Profile</span>
              </Link>
            )}
            {profile.linkedin_url && (
              <Link
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span>LinkedIn Profile</span>
              </Link>
            )}
            {profile.portfolio_url && (
              <Link
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Globe className="h-5 w-5" />
                <span>Portfolio</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}