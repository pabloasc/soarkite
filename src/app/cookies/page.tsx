import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Learn about how Vibecoders uses cookies and similar technologies to improve your experience.',
};

export default function CookiePolicy() {
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
          <h1 className="text-4xl font-normal mb-8">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our platform, and enabling certain features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and session management. You cannot opt out of these cookies.
              </p>

              <h3 className="text-xl font-medium mb-3">Performance Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our platform.
              </p>

              <h3 className="text-xl font-medium mb-3">Functionality Cookies</h3>
              <p className="text-gray-600 mb-4">
                These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
              </p>

              <h3 className="text-xl font-medium mb-3">Analytics Cookies</h3>
              <p className="text-gray-600 mb-4">
                We use analytics cookies to track and measure usage of the website so we can continue to produce engaging content and improve your experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">How We Use Cookies</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>To remember your preferences and settings</li>
                <li>To keep you signed in to our platform</li>
                <li>To understand how you use our website</li>
                <li>To monitor and analyze the performance of our platform</li>
                <li>To provide personalized features and content</li>
                <li>To improve our services based on your usage patterns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We use services from third parties that may set cookies on your device. These services include:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Google Analytics for website analytics</li>
                <li>Supabase for authentication and data storage</li>
                <li>Social media platforms for sharing and engagement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience of our website and prevent certain features from functioning properly.
              </p>
              <p className="text-gray-600 mb-4">
                To learn more about managing cookies, visit:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Cookie Settings in Chrome</a></li>
                <li>Firefox: <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Cookie Settings in Firefox</a></li>
                <li>Safari: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Cookie Settings in Safari</a></li>
                <li>Edge: <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Cookie Settings in Edge</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our use of cookies, please <Link href="/contact" className="text-black hover:underline">contact us</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}