'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { countries } from 'countries-list';

const EXPERIENCE_LEVELS = ['INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT', 'DISTINGUISHED'];
const AI_TOOLS = ['GitHub Copilot', 'Cursor IDE', 'V0', 'bolt.new', 'ChatGPT', 'Claude'];
const AI_EXPERTISE_LEVELS = ['Basic', 'Medium', 'Advanced'];

// Convert countries object to array and sort by name
const COUNTRIES = Object.entries(countries).map(([code, country]) => ({
  code,
  name: country.name,
  timezone: country.timezone
})).sort((a, b) => a.name.localeCompare(b.name));

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
    country: '',
    timezone: '',
    hourlyRate: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    aiToolsExperience: [] as { tool: string; expertise_level: string }[],
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
        country: existingProfile.location || '',
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
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          location: formData.country
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

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = COUNTRIES.find(c => c.code === countryCode);
    if (selectedCountry) {
      setFormData(prev => ({
        ...prev,
        country: selectedCountry.name,
        timezone: selectedCountry.timezone
      }));
    }
  };

  const handleAiToolAdd = () => {
    setFormData(prev => ({
      ...prev,
      aiToolsExperience: [
        ...prev.aiToolsExperience,
        { tool: '', expertise_level: 'Basic' }
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={COUNTRIES.find(c => c.name === formData.country)?.code || ''}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="">Select Country</option>
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
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
              <select
                value={tool.expertise_level}
                onChange={(e) => {
                  const newTools = [...formData.aiToolsExperience];
                  newTools[index].expertise_level = e.target.value;
                  setFormData({ ...formData, aiToolsExperience: newTools });
                }}
                className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {AI_EXPERTISE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
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