import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '@/components/contact-form';
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Soarkite for any questions about our AI coding assistance platform.',
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="h-8 w-32 relative">
            <Image
              src="/images/logo.png"
              alt="vibecoders"
              fill
              className="object-contain"
              priority
            />
          </Link>
          <nav>
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
              Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-normal mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <ContactForm />
        </div>
      </main>
    </div>
  );
}