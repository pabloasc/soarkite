'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const EXPERIENCE_LEVELS = ['INTERMEDIATE', 'SENIOR', 'LEAD', 'ARCHITECT'];
const AI_TOOLS = ['GitHub Copilot', 'Cursor IDE', 'V0', 'bolt.new', 'ChatGPT', 'Claude'];
const AI_EXPERTISE_LEVELS = ['Basic', 'Medium', 'Advanced'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

// Default values for new profiles
const DEFAULT_AVAILABILITY = {
  hours_per_week: 20,
  available_days: [] as string[],
  start_time: '09:00',
  end_time: '17:00'
};

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
    hourlyRate: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
    skills: [] as string[],
    aiToolsExperience: [] as { tool: string; expertise_level: string }[],
    specializations: [] as string[],
    languages: [] as string[],
    availability: DEFAULT_AVAILABILITY,
    certifications: [] as { name: string; issuer: string; year: number }[],
    company: ''
  });

  useEffect(() => {
    if (existingProfile) {
      // Safely get availability data with fallbacks
      const availability = existingProfile.availability || {};
      const safeAvailability = {
        hours_per_week: availability.hours_per_week || DEFAULT_AVAILABILITY.hours_per_week,
        available_days: Array.isArray(availability.available_days) ? availability.available_days : DEFAULT_AVAILABILITY.available_days,
        start_time: availability.start_time || DEFAULT_AVAILABILITY.start_time,
        end_time: availability.end_time || DEFAULT_AVAILABILITY.end_time
      };

      setFormData({
        title: existingProfile.title || '',
        experienceLevel: existingProfile.experience_level || 'SENIOR',
        yearsOfExperience: existingProfile.years_of_experience?.toString() || '',
        bio: existingProfile.bio || '',
        hourlyRate: existingProfile.hourly_rate?.toString() || '',
        githubUrl: existingProfile.github_url || '',
        linkedinUrl: existingProfile.linkedin_url || '',
        portfolioUrl: existingProfile.portfolio_url || '',
        skills: Array.isArray(existingProfile.skills) ? existingProfile.skills : [],
        aiToolsExperience: Array.isArray(existingProfile.ai_tools_experience) ? existingProfile.ai_tools_experience : [],
        specializations: Array.isArray(existingProfile.specializations) ? existingProfile.specializations : [],
        languages: Array.isArray(existingProfile.languages) ? existingProfile.languages : [],
        availability: safeAvailability,
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
      // Validate availability data
      const safeAvailability = {
        hours_per_week: Math.max(1, Math.min(168, Number(formData.availability.hours_per_week) || DEFAULT_AVAILABILITY.hours_per_week)),
        available_days: Array.isArray(formData.availability.available_days) ? formData.availability.available_days : DEFAULT_AVAILABILITY.available_days,
        start_time: formData.availability.start_time || DEFAULT_AVAILABILITY.start_time,
        end_time: formData.availability.end_time || DEFAULT_AVAILABILITY.end_time
      };

      const response = await fetch('/api/profile', {
        method: existingProfile ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
          yearsOfExperience: parseInt(formData.yearsOfExperience) || 0,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
          availability: safeAvailability
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

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const currentDays = Array.isArray(prev.availability.available_days) 
        ? prev.availability.available_days 
        : [];
      
      const days = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];

      return {
        ...prev,
        availability: {
          ...prev.availability,
          available_days: days
        }
      };
    });
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

  const handleAvailabilityChange = (field: keyof typeof DEFAULT_AVAILABILITY, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value
      }
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Availability
        </label>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Hours per week
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={formData.availability?.hours_per_week || DEFAULT_AVAILABILITY.hours_per_week}
              onChange={(e) => handleAvailabilityChange('hours_per_week', Math.max(1, Math.min(168, parseInt(e.target.value) || DEFAULT_AVAILABILITY.hours_per_week)))}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Available Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formData.availability?.available_days?.includes(day)
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Start Time
              </label>
              <select
                value={formData.availability?.start_time || DEFAULT_AVAILABILITY.start_time}
                onChange={(e) => handleAvailabilityChange('start_time', e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                End Time
              </label>
              <select
                value={formData.availability?.end_time || DEFAULT_AVAILABILITY.end_time}
                onChange={(e) => handleAvailabilityChange('end_time', e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
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