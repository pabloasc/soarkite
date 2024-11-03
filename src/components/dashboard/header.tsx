'use client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Bell, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userRole, setUserRole] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setUserRole(data.role);
      }
    };

    fetchUserRole();
  }, [user, supabase]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;

      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      if (!error && count !== null) {
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${user?.id}`,
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-32 relative">
              <Image
                src="/soarkite_logo.png"
                alt="Soarkite Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block absolute lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto bg-white lg:bg-transparent border-b lg:border-b-0 border-gray-200`}>
            <ul className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-8 p-4 lg:p-0">
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/requests" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                >
                  Requests
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/developers" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                >
                  Developers
                </Link>
              </li>
              {userRole === 'SENIOR_DEV' && (
                <li>
                  <Link 
                    href="/dashboard/profile" 
                    className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                  >
                    Profile
                  </Link>
                </li>
              )}
              <li>
                <Link 
                  href="/dashboard/inbox" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
              <li className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 text-gray-600 hover:text-black transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}