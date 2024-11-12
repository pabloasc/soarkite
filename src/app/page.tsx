import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Code, Sparkles, FileCode, Users } from 'lucide-react';
import { getUserInfo } from '@/lib/auth/server/supabase';
import Header from '@/components/shared/header';

export const metadata = {
  title: 'Soarkite - Get Expert Help with AI Tools',
  description: 'Connect with experienced prefessionals for real-time assistance with GitHub Copilot, Cursor IDE, V0, and bolt.new. Get professional guidance for your AI-powered development projects.',
  alternates: {
    canonical: 'https://soarkite.com'
  }
};

export default async function Home() {
  const user = await getUserInfo();

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-normal mb-6 leading-tight">
                  Expert guidance for your AI journey
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Receive instant support from expert professionals to elevate your AI coding, design, and photography projects to new heights.
                </p>
                <div className="flex gap-4">
                  {user ? (
                    <Link 
                      href="/dashboard" 
                      className="inline-flex px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href="/auth/sign-up?role=user" 
                        className="inline-flex px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                      >
                        I need help with AI tools
                      </Link>
                      <Link 
                        href="/auth/sign-up?role=senior_dev" 
                        className="inline-flex px-6 py-3 border border-black rounded-full hover:bg-gray-50 transition-colors"
                      >
                        I can provide help with AI tools
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/mascot.png"
                    alt="AI assistance visualization"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="text-4xl mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-8 bg-white rounded-lg">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  <FileCode size={24} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Create Request</h3>
                <p className="text-gray-600">Specify your AI tool and project details. Whether it's during coding or image creation, describe what you're working on and where you need help.</p>
              </div>
              <div className="p-8 bg-white rounded-lg">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mb-6">
                  <Users size={24} className="text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Get Connected</h3>
                <p className="text-gray-600">Experienced professionals review your request and reach out to help. Choose the expert that best matches your needs and schedule.</p>
              </div>
              <div className="p-8 bg-white rounded-lg">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-6">
                  <Code size={24} className="text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-3">Pair & Solve</h3>
                <p className="text-gray-600">Work together in a live session to solve your challenges, learn from them, and get your project moving forward.</p>
              </div>
            </div>
          </div>
        </section>

        {!user && (
          <>
            <section className="py-20">
              <div className="container mx-auto max-w-6xl px-6">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles size={24} className="text-blue-500" />
                  <h2 className="text-4xl">Two Ways to Participate</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-medium mb-4">For Creators Using AI Tools</h3>
                    <p className="text-gray-600">
                      Whether you're new to AI coding tools or need help understanding AI-generated code, 
                      our platform connects you with experienced developers who can guide you through the process.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-2xl font-medium mb-4">For Developers or Designers</h3>
                    <p className="text-gray-600">
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