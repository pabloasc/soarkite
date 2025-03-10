'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/auth/client/client';

export default function Header({ user }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const supabase = createClient();

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
                  href="/dashboard/profile" 
                  className={`text-sm transition-colors ${isActive('/dashboard/profile') ? 'text-black' : 'text-gray-600 hover:text-black'}`}
                >
                  Profile
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
                  src="/images/logo.png"
                  alt="Vibecoders Logo"
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
                  <Link 
                    href="/dashboard/profile" 
                    className={`block text-sm transition-colors py-2 ${isActive('/dashboard/profile') ? 'text-black' : 'text-gray-600'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
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