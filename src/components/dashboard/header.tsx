'use client';

import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { useState } from 'react';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                  href="/dashboard/profile" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/settings" 
                  className="text-gray-600 hover:text-black transition-colors block lg:inline-block"
                >
                  Settings
                </Link>
              </li>
              <li>
                <form action="/auth/sign-out" method="post">
                  <button 
                    type="submit"
                    className="text-gray-600 hover:text-black transition-colors block lg:inline-block w-full text-left"
                  >
                    Sign Out
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}