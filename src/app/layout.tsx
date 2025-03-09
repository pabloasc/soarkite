import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "vibecoders.co",
    template: "%s | Vibecoders"
  },
  description: "Get real-time expert guidance from experienced developers while using AI coding tools like GitHub Copilot, Cursor IDE, V0, and bolt.new. Connect with senior developers for personalized AI coding assistance.",
  keywords: [
    "AI coding help",
    "GitHub Copilot assistance",
    "Cursor IDE support",
    "V0 coding help",
    "bolt.new guidance",
    "AI programming support",
    "code generation help",
    "AI development assistance",
    "expert developer guidance",
    "real-time coding help",
    "AI tool assistance",
    "software development support",
    "AI pair programming",
    "coding mentorship",
    "developer consultation"
  ],
  authors: [{ name: "vibecoders" }],
  creator: "vibecoders",
  publisher: "vibecoders",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: ["/icons/favicon.ico"],
    shortcut: ["/icons/favicon.ico"],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      { rel: "icon", type: "image/png", sizes: "32x32", url: "/icons/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", url: "/icons/favicon-16x16.png" },
      { rel: "mask-icon", url: "/icons/safari-pinned-tab.svg", color: "#000000" }
    ]
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibecoders.co",
    siteName: "vibecoders",
    title: "vibecoders - Expert Help with AI Coding Tools",
    description: "Get real-time expert guidance from experienced developers while using AI coding tools like GitHub Copilot, Cursor IDE, V0, and bolt.new",
  },
  twitter: {
    card: "summary_large_image",
    title: "vibecoders",
    description: "Get real-time expert guidance from experienced developers while using AI coding tools",
    images: ["/images/vibecoders-main.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="canonical" href="https://vibecoders.co" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-gray-50 text-black">
          {children}
        </div>
        <Footer />
        <GoogleAnalytics gaId="G-HDK4GTGP5G" />
      </body>
    </html>
  );
}