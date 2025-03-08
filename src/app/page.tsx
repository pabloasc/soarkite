import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Code, Sparkles, FileCode, Users } from 'lucide-react';
import { getUserInfo } from '@/lib/auth/server/supabase';
import Header from '@/components/shared/header';
import { PrismaClient } from '@prisma/client';
import DevelopersList from '@/components/dashboard/developers/developers-list';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export const metadata = {
  title: 'vibecoders',
  description: 'Connect with experienced prefessionals for real-time assistance with GitHub Copilot, Cursor IDE, V0, and bolt.new. Get professional guidance for your AI-powered development projects.',
  alternates: {
    canonical: 'https://vibecoders.co'
  }
};

export default async function Home() {
  const user = await getUserInfo();

  // Get featured developers with their profiles and reviews
  const developers = await prisma.user.findMany({
    where: {
      role: 'VIBECODER',
      dev_profile: {
        isNot: null
      }
    },
    include: {
      dev_profile: true,
      reviews_received: {
        include: {
          reviewer: true
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 3
      }
    },
    orderBy: {
      dev_profile: {
        average_rating: 'desc'
      }
    },
    take: 6 // Limit to 6 developers for the home page
  });

  return (
    <div className="min-h-screen bg-white font-serif text-black">
      <Header user={user} />
      <main>
        {/* Featured Developers Section */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <Users size={28} className="text-purple-500" />
              <h2 className="text-5xl">Meet expert vibecoders</h2>
            </div>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl">
              Browse through our community of experienced developers ready to help with your AI-powered projects.
              Click on any profile to learn more about their experience.
            </p>
            
            <DevelopersList developers={developers} />
            
            <div className="mt-12 text-center flex justify-center gap-4">
              <Link 
                href="/developers" 
                className="inline-flex px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                View all vibecoders
              </Link>
              <Link 
                href={"/dashboard/profile"} 
                className="inline-flex px-8 py-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Create your profile
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}