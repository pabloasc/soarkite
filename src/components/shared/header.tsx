'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserRole } from '@prisma/client';
import { Menu, Bell, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/auth/client/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image_url?: string;
}

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchUnreadCount = async () => {
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
        filter: `receiver_id=eq.${user.id}`,
      }, () => {
        fetchUnreadCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 lg:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={'/'} className="flex-shrink-0">
            <div className="h-8 w-40 relative">
              <Image
                src="/images/logo.png"
                alt="vibecoders"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm transition-colors ${isActive('/dashboard') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  Overview
                </Link>
                {user.role === 'USER' && (
                  <Link 
                    href="/dashboard/requests" 
                    className={`text-sm transition-colors ${isActive('/dashboard/requests') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                  >
                    Requests
                  </Link>
                )}
                {user.role === 'SENIOR_DEV' && (
                  <Link 
                    href="/dashboard/profile" 
                    className={`text-sm transition-colors ${isActive('/dashboard/profile') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                  >
                    Profile
                  </Link>
                )}
                <Link 
                  href="/dashboard/inbox" 
                  className={`text-sm transition-colors relative ${isActive('/dashboard/inbox') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link 
                  href="/dashboard/settings" 
                  className={`text-sm transition-colors ${isActive('/dashboard/settings') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  <Settings className="h-4 w-4" />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-sm text-gray-600 hover:text-black transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/auth/sign-in" 
                  className="text-sm text-gray-600 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden fixed inset-0 z-50 bg-white`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="h-8 w-40 relative">
                <Image
                  src="/images/soarkite_logo.png"
                  alt="Soarkite Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className={`block text-sm transition-colors py-2 ${isActive('/dashboard') ? 'text-black' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Overview
                  </Link>
                  {user.role === 'USER' && (
                    <Link 
                      href="/dashboard/requests" 
                      className={`block text-sm transition-colors py-2 ${isActive('/dashboard/requests') ? 'text-black' : 'text-gray-600'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Requests
                    </Link>
                  )}
                  {user.role === 'SENIOR_DEV' && (
                    <Link 
                      href="/dashboard/profile" 
                      className={`block text-sm transition-colors py-2 ${isActive('/dashboard/profile') ? 'text-black' : 'text-gray-600'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  )}
                  <Link 
                    href="/dashboard/inbox" 
                    className={`block text-sm transition-colors py-2 relative ${isActive('/dashboard/inbox') ? 'text-black' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Messages
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className={`block text-sm transition-colors py-2 ${isActive('/dashboard/settings') ? 'text-black' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </span>
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm text-gray-600 hover:text-black transition-colors py-2"
                  >
                    <span className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/sign-in" 
                    className="block text-sm text-gray-600 hover:text-black transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}