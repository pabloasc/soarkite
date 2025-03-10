'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { assistants } from '@/lib/assistants/assistants';
import Image from 'next/image';

const EXPERIENCE_LEVELS = ['INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT'];

interface DevProfileFormProps {
  userId: string;
  existingProfile?: any;
  onCancel?: () => void;
}

export default function DevProfileForm({ userId, existingProfile, onCancel }: DevProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    experienceLevel: 'SENIOR',
    yearsOfExperience: '',
    bio: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    aiToolsExperience: [] as { tool: string; level_of_use: number }[],
    specializations: [] as string[],
    languages: [] as string[],
    certifications: [] as { name: string; issuer: string; year: number }[],
    company: ''
  });

  useEffect(() => {
    if (existingProfile) {
      const transformedAiTools = Array.isArray(existingProfile.ai_tools_experience) 
        ? existingProfile.ai_tools_experience.map((tool: any) => {
            if (tool.expertise_level) {
              const levelMap: Record<string, number> = {
                'Basic': 1,
                'Medium': 3,
                'Advanced': 5
              };
              return {
                tool: tool.tool,
                level_of_use: tool.level_of_use !== undefined ? tool.level_of_use : levelMap[tool.expertise_level] || 3
              };
            }
            return tool;
          })
        : [];

      setFormData({
        title: existingProfile.title || '',
        experienceLevel: existingProfile.experience_level || 'SENIOR',
        yearsOfExperience: existingProfile.years_of_experience?.toString() || '',
        bio: existingProfile.bio || '',
        githubUrl: existingProfile.github_url || '',
        linkedinUrl: existingProfile.linkedin_url || '',
        portfolioUrl: existingProfile.portfolio_url || '',
        skills: Array.isArray(existingProfile.skills) ? existingProfile.skills : [],
        aiToolsExperience: transformedAiTools,
        specializations: Array.isArray(existingProfile.specializations) ? existingProfile.specializations : [],
        languages: Array.isArray(existingProfile.languages) ? existingProfile.languages : [],
        certifications: Array.isArray(existingProfile.certifications) ? existingProfile.certifications : [],
        company: existingProfile.company || ''
      });
    }
  }, [existingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {

      const response = await fetch('/api/profile', {
        method: existingProfile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      if (onCancel) {
        onCancel();
      }
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAiToolAdd = () => {
    setFormData(prev => ({
      ...prev,
      aiToolsExperience: [
        ...prev.aiToolsExperience,
        { tool: '', level_of_use: 3 }
      ]
    }));
  };

  const handleCertificationAdd = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { name: '', issuer: '', year: new Date().getFullYear() }
      ]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Title
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="e.g., Senior Full Stack Developer"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Experience Level
          </label>
          <select
            required
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          >
            {EXPERIENCE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            required
            min="0"
            value={formData.yearsOfExperience}
            onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          required
          rows={4}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          placeholder="Tell us about your experience and expertise..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub URL
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio URL
          </label>
          <input
            type="url"
            value={formData.portfolioUrl}
            onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="https://your-portfolio.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Tools Experience
        </label>
        <div className="space-y-6">
          {formData.aiToolsExperience.map((tool, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 flex items-center gap-3">
                  {tool.tool && (
                    <div className="relative w-8 h-8 flex-shrink-0 overflow-hidden">
                      {assistants.find(a => a.name === tool.tool)?.icon ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={`/images/ai-tools/${assistants.find(a => a.name === tool.tool)?.icon}`}
                            alt={tool.tool}
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              // If image fails to load, replace with fallback
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-full"><span class="text-sm font-medium text-gray-500">${tool.tool.charAt(0)}</span></div>`;
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
                          <span className="text-sm font-medium text-gray-500">
                            {tool.tool.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <select
                    value={tool.tool}
                    onChange={(e) => {
                      const newTools = [...formData.aiToolsExperience];
                      newTools[index].tool = e.target.value;
                      setFormData({ ...formData, aiToolsExperience: newTools });
                    }}
                    className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select AI Tool</option>
                    {assistants.map(assistant => (
                      <option key={assistant.id} value={assistant.name}>{assistant.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      aiToolsExperience: formData.aiToolsExperience.filter((_, i) => i !== index)
                    });
                  }}
                  className="px-3 py-2 text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Level of Use (0-5)
                  </label>
                  <span className="text-sm font-medium">{tool.level_of_use}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="1"
                  value={tool.level_of_use}
                  onChange={(e) => {
                    const newTools = [...formData.aiToolsExperience];
                    newTools[index].level_of_use = parseInt(e.target.value);
                    setFormData({ ...formData, aiToolsExperience: newTools });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Never use</span>
                  <span>Occasional</span>
                  <span>Power user</span>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAiToolAdd}
            className="text-sm text-black hover:text-gray-700 flex items-center"
          >
            + Add AI Tool
          </button>
        </div>
      </div>
      <div className="flex justify-end space-x-4 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {existingProfile ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            existingProfile ? 'Save Changes' : 'Create Profile'
          )}
        </button>
      </div>
    </form>
  );
}