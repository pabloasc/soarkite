import React from 'react';
import Image from 'next/image';
import { Brain, Users, Lightbulb } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-white text-black py-4 border-b border-black">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <Image
              src="/images/logo-full.png"
              alt="Soarkite Logo"
              width={140}
              height={50}
              className="mr-2"
            />
          </div>
          <nav>
            <ul className="flex space-x-4 font-source-serif">
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#services" className="hover:underline">Services</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
            <Image
              src="/images/soarkite-main.png"
              alt="Colorful kite representing AI journey assistance"
              width={500}
              height={500}
              className="rounded-lg"
            />
            
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-playfair font-bold mb-4">Navigate Your AI Journey with Human Insight</h2>
            <p className="text-lg mb-4 font-source-serif">At Soarkite, we provide human assistance for your AI journeys, ensuring you soar to new heights of innovation and understanding.</p>
          </div>
        </section>

        <section id="banner" className="mb-12">
          <div className="reader-digest-border p-6 bg-white">
            <h3 className="text-2xl font-playfair font-bold mb-2">This Month's Spotlight</h3>
            <p className="font-source-serif">Discover how our expert guidance helped a startup revolutionize their customer service with AI-powered chatbots while maintaining a human touch.</p>
          </div>
        </section>

        <section id="services" className="mb-12">
          <h2 className="text-3xl font-playfair font-bold mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Brain size={48} className="mb-4" />
              <h3 className="text-xl font-playfair font-bold mb-2">AI Strategy Consulting</h3>
              <p className="font-source-serif">We help you develop a comprehensive AI strategy tailored to your business needs.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users size={48} className="mb-4" />
              <h3 className="text-xl font-playfair font-bold mb-2">AI Implementation Support</h3>
              <p className="font-source-serif">Our experts guide you through the process of integrating AI solutions into your existing systems.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Lightbulb size={48} className="mb-4" />
              <h3 className="text-xl font-playfair font-bold mb-2">AI Innovation Workshops</h3>
              <p className="font-source-serif">Participate in our interactive workshops to spark AI-driven innovation within your organization.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-black text-white py-4">
        <div className="container mx-auto text-center">
          <p className="font-source-serif">&copy; 2024 Soarkite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}