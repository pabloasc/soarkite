import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Loading from "./loading";
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Soarkite - Expert Help with AI Coding Tools",
    template: "%s | Soarkite"
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
  authors: [{ name: "Soarkite" }],
  creator: "Soarkite",
  publisher: "Soarkite",
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
    url: "https://soarkite.com",
    siteName: "Soarkite",
    title: "Soarkite - Expert Help with AI Coding Tools",
    description: "Get real-time expert guidance from experienced developers while using AI coding tools like GitHub Copilot, Cursor IDE, V0, and bolt.new",
    images: [
      {
        url: "/images/soarkite-main.jpg",
        width: 1200,
        height: 630,
        alt: "Soarkite - AI Coding Assistance Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Soarkite - Expert Help with AI Coding Tools",
    description: "Get real-time expert guidance from experienced developers while using AI coding tools",
    images: ["/images/soarkite-main.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-serif`}>
      <head>
        <link rel="canonical" href="https://soarkite.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icons/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-50 text-black">
        <div className="flex-grow">
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-HDK4GTGP5G" />
    </html>
  );
}