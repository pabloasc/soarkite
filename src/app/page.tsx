import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Code, MessageSquare, Sparkles, Bot } from 'lucide-react';
import AnimatedLogos from '@/components/animated-logos';
import ContactForm from '@/components/contact-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="h-8 w-32 relative">
            <Image
              src="/images/soarkite-logo.svg"
              width={45}
              height={45}
              alt="Soarkite Logo"
              className="object-contain"
              priority
            />
          </div>
          <nav>
            <ul className="flex space-x-8">
              <li><a href="#about" className="text-gray-600 hover:text-black transition-colors">About</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-black transition-colors">Services</a></li>
              <li><Link href="/auth/sign-in" className="text-gray-600 hover:text-black transition-colors">Sign In</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-normal mb-6 leading-tight">Expert guidance for your AI coding journey</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Get real-time support from senior developers while using AI coding tools like v0 or bolt.new
                </p>
                <div className="flex gap-4">
                  <Link 
                    href="/auth/sign-up?role=user" 
                    className="inline-flex px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Get Help
                  </Link>
                  <Link 
                    href="/auth/sign-up?role=senior_dev" 
                    className="inline-flex px-6 py-3 border border-black rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Become a Mentor
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative w-full aspect-square">
                  <Image
                    src="/images/soarkite-main.png"
                    alt="AI coding assistance visualization"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
                <AnimatedLogos />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50" id="services">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="text-4xl mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="p-6 bg-white rounded-lg">
                <Bot size={32} className="mb-4" />
                <h3 className="text-xl font-medium mb-3">AI Tool Integration</h3>
                <p className="text-gray-600">Get help with GitHub Copilot, Cursor IDE, v0, and other AI coding assistants</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <MessageSquare size={32} className="mb-4" />
                <h3 className="text-xl font-medium mb-3">Expert Guidance</h3>
                <p className="text-gray-600">Connect with senior developers who understand both traditional and AI-assisted coding</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <Code size={32} className="mb-4" />
                <h3 className="text-xl font-medium mb-3">Real-time Support</h3>
                <p className="text-gray-600">Get immediate assistance when you're stuck with AI-generated code</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20" id="about">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles size={24} className="text-blue-500" />
              <h2 className="text-4xl">Two Ways to Participate</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-medium mb-4">For Creators Seeking Help</h3>
                <p className="text-gray-600">
                  Whether you're new to AI coding tools or need help understanding AI-generated code, 
                  our platform connects you with experienced developers who can guide you through the process.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-2xl font-medium mb-4">For Senior Developers</h3>
                <p className="text-gray-600">
                  Share your expertise with creators working with AI tools. Help bridge the gap 
                  between traditional coding practices and AI-assisted development.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-50">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="text-4xl mb-12">Want to know more?</h2>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-gray-100">
        <div className="container mx-auto max-w-6xl px-6 text-center text-gray-600">
          <p>&copy; 2024 Soarkite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}