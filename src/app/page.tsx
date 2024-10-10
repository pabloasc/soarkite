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
            <h2 className="text-4xl font-playfair mb-4">Navigate Your AI Journey with Human Insight</h2>
            <p className="text-lg mb-4 font-serif">At Soarkite, we provide human assistance for your AI journeys, ensuring you soar to new heights of innovation and understanding.</p>
          </div>
        </section>

        <section id="banner" className="mb-12">
          <div className="reader-digest-border p-6 bg-white">
            <h3 className="text-2xl font-playfair mb-2">This Month's Spotlight</h3>
            <p className="font-serif">Discover how our expert guidance helped a startup revolutionize their customer service with AI-powered chatbots while maintaining a human touch.</p>
          </div>
        </section>

        <section id="services" className="mb-12">

        <h3 className="text-3xl mb-8">Our Services</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="border-t-2 border-black pt-6">
              <Brain size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-4">AI Strategy Consulting</h4>
              <p className="text-lg">We help you develop a comprehensive AI strategy tailored to your business needs.</p>
            </div>
            <div className="border-t-2 border-black pt-6">
              <Users size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-4">AI Implementation Support</h4>
              <p className="text-lg">Our experts guide you through the process of integrating AI solutions into your existing systems.</p>
            </div>
            <div className="border-t-2 border-black pt-6">
              <Lightbulb size={40} className="mb-4" />
              <h4 className="text-2xl font-bold mb-4">AI Innovation Workshops</h4>
              <p className="text-lg">Participate in our interactive workshops to spark AI-driven innovation within your organization.</p>
            </div>
          </div>

          <blockquote className="text-2xl border-l-4 border-black pl-8 mb-12">
            "Soarkite has been instrumental in helping us navigate the complex world of AI. Their human-centric approach ensured that our AI implementation not only improved efficiency but also enhanced our customer experience."
          </blockquote>

          <p className="text-lg mb-12">
            As we look to the future, the role of AI in business and society will only continue to grow. With Soarkite as your guide, you can be confident that you're not just keeping up with the latest trends, but staying ahead of the curve. Our commitment to blending human insight with artificial intelligence ensures that your AI journey is not just successful, but truly transformative.
          </p>
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