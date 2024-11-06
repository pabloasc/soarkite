import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using the Soarkite AI coding assistance platform.',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <Link href="/" className="h-8 w-32 relative">
            <Image
              src="/images/soarkite_logo.png"
              alt="Soarkite"
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
          <h1 className="text-4xl font-normal mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                Welcome to Soarkite. By using our platform, you agree to these terms and conditions. Please read them carefully.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">2. Services</h2>
              <p className="text-gray-600 mb-4">
                Soarkite provides a platform connecting users seeking assistance with AI coding tools to experienced software developers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide accurate information when creating an account</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform in compliance with applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">4. Developer Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Provide accurate expertise and qualification information</li>
                <li>Deliver services professionally and timely</li>
                <li>Maintain confidentiality of user projects</li>
                <li>Comply with platform guidelines and best practices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">5. Intellectual Property</h2>
              <p className="text-gray-600 mb-4">
                Users retain rights to their original code and projects. Assistance provided through the platform does not transfer intellectual property rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">6. Privacy</h2>
              <p className="text-gray-600 mb-4">
                We respect your privacy and handle personal data in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                Soarkite is not responsible for code quality or project outcomes. Users are advised to review and test all code implementations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}