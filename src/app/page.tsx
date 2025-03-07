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
    canonical: 'https://soarkite.com'
  }
};

export default async function Home() {
  const user = await getUserInfo();

  // Get featured developers with their profiles and reviews
  const developers = await prisma.user.findMany({
    where: {
      role: 'SENIOR_DEV',
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
              <h2 className="text-5xl">Meet Expert Vibe Coders</h2>
            </div>
            <p className="text-xl text-gray-700 mb-12 max-w-3xl">
              Browse through our community of experienced developers ready to help with your AI-powered projects.
              Click on any profile to learn more about their expertise and experience.
            </p>
            
            <DevelopersList developers={developers} />
            
            <div className="mt-12 text-center">
              <Link 
                href="/developers" 
                className="inline-flex px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                View All Developers
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-100">
          <div className="container mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="text-5xl mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="p-10 bg-white rounded-lg shadow-lg">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-8">
                  <FileCode size={28} className="text-blue-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Create Request</h3>
                <p className="text-gray-800">Specify your AI tool and project details. Whether it's during coding or designing, describe what you're working on and where you need help.</p>
              </div>
              <div className="p-10 bg-white rounded-lg shadow-lg">
                <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center mb-8">
                  <Users size={28} className="text-purple-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Get Connected</h3>
                <p className="text-gray-800">Experienced professionals review your request and reach out to help. Choose the expert that best matches your needs and schedule.</p>
              </div>
              <div className="p-10 bg-white rounded-lg shadow-lg">
                <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center mb-8">
                  <Code size={28} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Pair & Solve</h3>
                <p className="text-gray-800">Work together in a live session to solve your challenges, learn from them, and get your project moving forward.</p>
              </div>
            </div>
          </div>
        </section>

        {!user && (
          <>
            <section className="py-24">
              <div className="container mx-auto max-w-5xl px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                  <Sparkles size={28} className="text-blue-500" />
                  <h2 className="text-5xl">Two Ways to Participate</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
                  <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="text-3xl font-medium mb-6">For Creators Using AI Tools</h3>
                    <p className="text-gray-800">
                      Whether you're new to AI coding tools or need help understanding AI-generated code, 
                      our platform connects you with experienced developers who can guide you through the process.
                    </p>
                  </div>
                  <div className="bg-white p-10 rounded-lg shadow-lg border border-gray-200">
                    <h3 className="text-3xl font-medium mb-6">For Developers or Designers</h3>
                    <p className="text-gray-800">
                      Share your expertise with creators and help them transform their ideas into reality using AI. 
                      By collaborating and guiding them through the process, you can enable innovative projects and inspire new possibilities.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}