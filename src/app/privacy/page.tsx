import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about how Soarkite collects, uses, and protects your personal information.',
};

export default function Privacy() {
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
          <h1 className="text-4xl font-normal mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Introduction</h2>
              <p className="text-gray-600 mb-4">
                At Soarkite, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Name and email address</li>
                <li>Profile information (for developers)</li>
                <li>Payment information</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-medium mb-3">Usage Information</h3>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Browser and device information</li>
                <li>IP address and location data</li>
                <li>Platform usage statistics</li>
                <li>Communication history</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>To provide and maintain our services</li>
                <li>To match users with appropriate developers</li>
                <li>To process payments and transactions</li>
                <li>To improve our platform and user experience</li>
                <li>To communicate with you about our services</li>
                <li>To prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Other users as necessary for service delivery</li>
                <li>Service providers and business partners</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Encryption of sensitive data</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure data storage and transmission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to improve your experience. For more information, please see our <Link href="/cookies" className="text-black hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for users under 16 years of age. We do not knowingly collect or maintain information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">International Data Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-medium mb-4">Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please <Link href="/contact" className="text-black hover:underline">contact us</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}