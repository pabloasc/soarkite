import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { getUserInfo } from '@/lib/auth/server/supabase';
export const dynamic = "force-dynamic"
import Link from 'next/link';
import { 
  UserCircle, 
  Settings, 
  Users, 
  ExternalLink, 
  Github, 
  Code,
  Linkedin
} from 'lucide-react';
import Image from 'next/image';

const prisma = new PrismaClient();

export default async function Dashboard() {
  const userInfo = await getUserInfo();
  
  if (!userInfo) {
    redirect('/auth/sign-in');
  }

  // Get user with profile data
  const user = await prisma.user.findUnique({
    where: { id: userInfo.id },
    include: {
      dev_profile: true
    }
  });

  const actionCards = [
    {
      title: "Edit Profile",
      description: "Update your personal information and developer profile",
      icon: <UserCircle className="h-8 w-8" />,
      href: "/dashboard/profile",
      color: "bg-blue-50 text-blue-700 border-blue-200"
    },
    {
      title: "Account Settings",
      description: "Manage your account preferences and notifications",
      icon: <Settings className="h-8 w-8" />,
      href: "/dashboard/settings",
      color: "bg-purple-50 text-purple-700 border-purple-200"
    },
    {
      title: "Browse Developers",
      description: "Discover other developers in the community",
      icon: <Users className="h-8 w-8" />,
      href: "/developers",
      color: "bg-green-50 text-green-700 border-green-200"
    },
    {
      title: "View Public Profile",
      description: "See how your profile appears to others",
      icon: <ExternalLink className="h-8 w-8" />,
      href: `/developers/${userInfo.id}`,
      color: "bg-amber-50 text-amber-700 border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-normal mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'Developer'}</p>
        </div>

        {/* Action Cards */}
        <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {actionCards.map((card, index) => (
            <Link key={index} href={card.href} className="block">
              <div className={`border rounded-lg p-6 transition-all hover:shadow-md ${card.color}`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1">{card.icon}</div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">{card.title}</h3>
                    <p className="text-sm opacity-80">{card.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Developer Tools */}
        <h2 className="text-xl font-medium mb-4">Developer Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" className="block">
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Github className="h-6 w-6" />
                <h3 className="font-medium">GitHub Copilot</h3>
              </div>
              <p className="text-sm text-gray-600">AI pair programming tool that helps you write better code faster.</p>
            </div>
          </a>
          <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="block">
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Code className="h-6 w-6" />
                <h3 className="font-medium">Cursor IDE</h3>
              </div>
              <p className="text-sm text-gray-600">AI-powered code editor built for pair programming with AI.</p>
            </div>
          </a>
          <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="block">
            <div className="border border-gray-200 rounded-lg p-6 bg-white hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <Code className="h-6 w-6" />
                <h3 className="font-medium">V0</h3>
              </div>
              <p className="text-sm text-gray-600">Generate UI components and applications with AI.</p>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}