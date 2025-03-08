import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="h-8 w-32 relative mb-4">
              <Image
                src="/images/logo.png"
                alt="vibecoders"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-600 mb-4">
              Get expert guidance for your AI-powered development journey. Connect with experienced developers for real-time assistance with modern AI coding tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/vibecoders" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/vibecoders" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/vibecoders" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:team@vibecoders.co" className="text-gray-600 hover:text-black">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard/developers" className="text-gray-600 hover:text-black">
                  Find Developers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/requests/new" className="text-gray-600 hover:text-black">
                  Create Request
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-black">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-black">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-black">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-black">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Vibecoders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}