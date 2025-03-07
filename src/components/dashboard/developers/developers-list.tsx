'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Clock, Activity } from 'lucide-react';
import { createClient } from '@/lib/auth/client/client';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { addDays } from 'date-fns';

interface DevelopersListProps {
  developers: any[]; // Type this based on your User model with includes
}

export default function DevelopersList({ developers }: DevelopersListProps) {
  const [onlineDevelopers, setOnlineDevelopers] = useState<Set<string>>(new Set());
  const [userTimezone, setUserTimezone] = useState('');
  const supabase = createClient();

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  useEffect(() => {
    // Subscribe to presence changes
    const channel = supabase.channel('online-users');

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const onlineIds = new Set(
          Object.values(state)
            .flat()
            .map((user: any) => user.user_id)
        );
        setOnlineDevelopers(onlineIds);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await channel.track({
              online_at: new Date().toISOString(),
              user_id: user.id
            });
          }
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  const isAvailableNow = (developer: any) => {
    try {
      if (!developer?.dev_profile?.availability) return false;

      const { available_days, start_time, end_time } = developer.dev_profile.availability;
      const devTimezone = developer.timezone || 'UTC';

      // Safety checks for availability data
      if (!Array.isArray(available_days) || !start_time || !end_time) return false;

      // Get current time in developer's timezone
      const now = new Date();
      const devNow = formatInTimeZone(now, devTimezone, 'HH:mm');
      const devDay = formatInTimeZone(now, devTimezone, 'EEEE');

      return (
        available_days.includes(devDay) &&
        devNow >= start_time &&
        devNow <= end_time &&
        onlineDevelopers.has(developer.id)
      );
    } catch (error) {
      console.error('Error checking developer availability:', error);
      return false;
    }
  };

  const getAvailabilityTime = (developer: any) => {
    try {
      const availability = developer?.dev_profile?.availability;
      const devTimezone = developer.timezone;
      
      if (!availability?.start_time || !availability?.end_time || !devTimezone) {
        return 'Schedule not set';
      }

      // If developer timezone is different from user timezone, show both
      if (devTimezone !== userTimezone) {
        const now = new Date();
        const [startHour, startMinute] = availability.start_time.split(':').map(Number);
        const [endHour, endMinute] = availability.end_time.split(':').map(Number);

        // Create dates in developer's timezone
        const devStartDate = zonedTimeToUtc(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute),
          devTimezone
        );
        const devEndDate = zonedTimeToUtc(
          new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute),
          devTimezone
        );

        // If end time is before start time, add a day to end time
        if (devEndDate < devStartDate) {
          devEndDate.setDate(devEndDate.getDate() + 1);
        }

        // Format times in both timezones
        const userStartTime = formatInTimeZone(devStartDate, userTimezone, 'HH:mm');
        const userEndTime = formatInTimeZone(devEndDate, userTimezone, 'HH:mm');

        return `${availability.start_time}-${availability.end_time} (${devTimezone})\n${userStartTime}-${userEndTime} (your time)`;
      }

      return `${availability.start_time}-${availability.end_time} (${devTimezone})`;
    } catch (error) {
      console.error('Error formatting availability time:', error);
      return 'Schedule not set';
    }
  };

  if (!Array.isArray(developers) || developers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-500">No software developers found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {developers.map((developer) => (
        <div key={developer.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  {developer.image_url ? (
                    <Image
                      src={developer.image_url}
                      alt={developer.name || 'Profile'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-gray-400">
                      {(developer.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {isAvailableNow(developer) && (
                  <div className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                    <Activity className="h-3 w-3" />
                    <span>Live</span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {developer.name || 'Anonymous Developer'}
                </h3>
                <p className="text-sm text-gray-600">
                  {developer.dev_profile?.title || 'Software Developer'}
                </p>
              </div>
            </div>
            {developer.dev_profile?.average_rating !== undefined && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">
                  {developer.dev_profile.average_rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {developer.dev_profile && (
            <>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                {developer.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{developer.country}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="whitespace-pre-line">{getAvailabilityTime(developer)}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 line-clamp-2">
                  {developer.dev_profile.bio || 'No bio available'}
                </p>
              </div>

              {Array.isArray(developer.dev_profile.skills) && developer.dev_profile.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {developer.dev_profile.skills.slice(0, 3).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {developer.dev_profile.skills.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{developer.dev_profile.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          <Link
            href={`/developers/${developer.id}`}
            className="block w-full text-center px-4 py-2 border border-black rounded-md text-sm font-medium text-black hover:bg-black hover:text-white transition-colors"
          >
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );
}