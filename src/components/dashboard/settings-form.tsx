'use client';

import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { initializeStorage } from '@/lib/supabase';
import { createClient } from '@/lib/auth/client/client';
import { countries } from 'countries-list';

// Convert countries object to array and sort by name
const COUNTRIES = Object.entries(countries).map(([code, country]) => ({
  code,
  name: country.name,
})).sort((a, b) => a.name.localeCompare(b.name));

interface SettingsFormProps {
  user: User;
  profile: any;
}

export default function SettingsForm({ user, profile }: SettingsFormProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [imageUrl, setImageUrl] = useState(profile?.image_url || null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    role: profile?.role || 'USER',
    country: profile?.country || '',
    timezone: '',
    email_notifications: profile?.email_notifications ?? true,
    theme: profile?.theme || 'light',
    language: profile?.language || 'en',
  });

  // Set initial timezone from profile or browser
  useEffect(() => {
    const initialTimezone = profile?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFormData(prev => ({ ...prev, timezone: initialTimezone }));
  }, [profile?.timezone]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
      return;
    }

    setUploadingImage(true);
    setMessage(null);

    try {
      await initializeStorage('soarkite');

      if (imageUrl) {
        const oldFileName = imageUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('soarkite')
            .remove([oldFileName]);
        }
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('soarkite')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('soarkite')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('users')
        .update({ image_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setImageUrl(publicUrl);
      setMessage({ type: 'success', text: 'Profile picture updated successfully' });
    } catch (error: any) {
      console.error('Image upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imageUrl) return;

    setUploadingImage(true);
    setMessage(null);

    try {
      const fileName = imageUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid image URL');

      const { error: deleteError } = await supabase.storage
        .from('soarkite')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('users')
        .update({ image_url: null })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setImageUrl(null);
      setMessage({ type: 'success', text: 'Profile picture removed successfully' });
    } catch (error: any) {
      console.error('Image removal error:', error);
      setMessage({ type: 'error', text: 'Failed to remove image. Please try again.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          role: formData.role,
          country: formData.country,
          timezone: formData.timezone,
          email_notifications: formData.email_notifications,
          theme: formData.theme,
          language: formData.language,
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (error) {
      console.error('Settings update failed:', error);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
                {formData.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {uploadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          {imageUrl && !uploadingImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <label className="relative cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            {imageUrl ? 'Change Picture' : 'Upload Picture'}
          </span>
        </label>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          id="country"
          value={COUNTRIES.find(c => c.name === formData.country)?.code || ''}
          onChange={(e) => {
            const country = COUNTRIES.find(c => c.code === e.target.value);
            if (country) {
              setFormData({ ...formData, country: country.name });
            }
          }}
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

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
          Timezone
        </label>
        <select
          id="timezone"
          value={formData.timezone}
          onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          {Intl.supportedValuesOf('timeZone').map(timezone => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="USER">Creator</option>
          <option value="VIBECODER">Software Developer</option>
        </select>
      </div>

      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
          Language
        </label>
        <select
          id="language"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
          Theme
        </label>
        <select
          id="theme"
          value={formData.theme}
          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="email_notifications"
          checked={formData.email_notifications}
          onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
          className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
        />
        <label htmlFor="email_notifications" className="ml-2 block text-sm text-gray-700">
          Receive email notifications
        </label>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}