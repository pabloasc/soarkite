'use client';

import { useState } from 'react';
import { MapPin, DollarSign, Github, Linkedin, Globe, Edit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import DevProfileForm from './dev-profile-form';
import { type Assistant, assistants } from '@/lib/assistants/assistants';

interface DevProfileViewProps {
  developer: any; // Type this based on your User model with includes
  isAdmin?: boolean;
  isLoggedIn?: boolean;
}

// Define the AIToolExperience interface
interface AIToolExperience {
  tool: string;
  level_of_use?: number;
  expertise_level?: string;
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

  // Get AI tools with their details from assistants
  const getAiToolDetails = (toolName: string) => {
    console.log(toolName);
    return assistants.find(assistant => assistant.name === toolName) || {
      id: toolName.toLowerCase().replace(/\s+/g, '-'),
      name: toolName,
      icon: '',
      description: '',
      link: ''
    };
  };

  // Sort AI tools by level of use (descending)
  // First, deduplicate tools by name
  const toolsMap = new Map<string, AIToolExperience>();
  (profile.ai_tools_experience || []).forEach((tool: AIToolExperience) => {
    toolsMap.set(tool.tool, tool);
  });
  
  // Convert to array and sort
  const sortedAiTools = Array.from(toolsMap.values()).sort((a, b) => {
    // Handle both old and new formats
    const levelA = a.level_of_use !== undefined ? a.level_of_use : 
      (a.expertise_level === 'Advanced' ? 5 : a.expertise_level === 'Medium' ? 3 : 1);
    const levelB = b.level_of_use !== undefined ? b.level_of_use : 
      (b.expertise_level === 'Advanced' ? 5 : b.expertise_level === 'Medium' ? 3 : 1);
    return levelB - levelA;
  });

  // Get level label
  const getLevelLabel = (level: number) => {
    if (level === 0) return 'Never use';
    if (level <= 2) return 'Occasional';
    return 'Power user';
  };

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

          {/* AI Tools Experience - Enhanced View */}
          {sortedAiTools.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Favourite Tools</h3>
              
              {/* One tool per line display */}
              <div className="space-y-3">
                {sortedAiTools.map((tool, index) => {
                  const toolDetails = getAiToolDetails(tool.tool);
                  const level = tool.level_of_use !== undefined ? tool.level_of_use : 
                    (tool.expertise_level === 'Advanced' ? 5 : tool.expertise_level === 'Medium' ? 3 : 1);
                  
                  return (
                    <div key={index} className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                      {/* Logo */}
                      <div className="relative w-10 h-10 flex-shrink-0 overflow-hidden mr-3">
                        {toolDetails.icon ? (
                          <Image
                            src={`/images/ai-tools/${toolDetails.icon}`}
                            alt={toolDetails.name}
                            width={40}
                            height={40}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              // If image fails to load, replace with fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-full"><span class="text-sm font-medium text-gray-500">${toolDetails.name.charAt(0)}</span></div>`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                            <span className="text-sm font-medium text-gray-500">
                              {toolDetails.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tool Name */}
                      <div className="font-medium w-32 flex-shrink-0">{tool.tool}</div>
                      
                      {/* Horizontal Slider with Labels */}
                      <div className="flex-1 ml-4">
                        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full ${
                              level >= 4 ? 'bg-green-500' : level >= 2 ? 'bg-blue-500' : 'bg-gray-400'
                            }`}
                            style={{ width: `${(level / 5) * 100}%` }}
                          ></div>
                          {/* Slider Thumb (Non-interactive) */}
                          <div 
                            className="absolute top-0 w-3 h-3 bg-white border-2 border-gray-400 rounded-full shadow-sm pointer-events-none" 
                            style={{ 
                              left: `calc(${(level / 5) * 100}% - 6px)`,
                              top: '-0.5px'
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Never use</span>
                          <span>Occasional</span>
                          <span>Power user</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
          <div className="grid gap-4 text-center">
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