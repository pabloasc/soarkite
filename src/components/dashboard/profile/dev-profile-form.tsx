'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const EXPERIENCE_LEVELS = ['INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT', 'DISTINGUISHED'];
const AI_TOOLS = ['GitHub Copilot', 'Cursor IDE', 'V0', 'bolt.new', 'ChatGPT', 'Claude'];

interface DevProfileFormProps {
  userId: string;
  existingProfile?: any; // Type this based on your DevProfile model
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
    location: '',
    timezone: '',
    hourlyRate: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    aiToolsExperience: [] as { tool: string; years: number; expertise_level: string }[],
    specializations: [] as string[],
    languages: [] as string[],
    availability: {
      hours_per_week: 0,
      preferred_times: [] as string[]
    },
    certifications: [] as { name: string; issuer: string; year: number }[],
    company: ''
  });

  useEffect(() => {
    if (existingProfile) {
      setFormData({
        title: existingProfile.title || '',
        experienceLevel: existingProfile.experience_level || 'SENIOR',
        yearsOfExperience: existingProfile.years_of_experience?.toString() || '',
        bio: existingProfile.bio || '',
        location: existingProfile.location || '',
        timezone: existingProfile.timezone || '',
        hourlyRate: existingProfile.hourly_rate?.toString() || '',
        githubUrl: existingProfile.github_url || '',
        linkedinUrl: existingProfile.linkedin_url || '',
        portfolioUrl: existingProfile.portfolio_url || '',
        skills: existingProfile.skills || [],
        aiToolsExperience: existingProfile.ai_tools_experience || [],
        specializations: existingProfile.specializations || [],
        languages: existingProfile.languages || [],
        availability: existingProfile.availability || {
          hours_per_week: 0,
          preferred_times: []
        },
        certifications: existingProfile.certifications || [],
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
          yearsOfExperience: parseInt(formData.yearsOfExperience),
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null
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
        { tool: '', years: 0, expertise_level: 'INTERMEDIATE' }
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <input
            type="text"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="e.g., UTC+1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          AI Tools Experience
        </label>
        <div className="space-y-4">
          {formData.aiToolsExperience.map((tool, index) => (
            <div key={index} className="flex gap-4">
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
                {AI_TOOLS.map(tool => (
                  <option key={tool} value={tool}>{tool}</option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="Years"
                value={tool.years}
                onChange={(e) => {
                  const newTools = [...formData.aiToolsExperience];
                  newTools[index].years = parseFloat(e.target.value);
                  setFormData({ ...formData, aiToolsExperience: newTools });
                }}
                className="w-24 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
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
          ))}
          <button
            type="button"
            onClick={handleAiToolAdd}
            className="text-sm text-black hover:text-gray-700"
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