'use client'

import { usePathname } from 'next/navigation'
import { Inter, Playfair_Display } from "next/font/google"
import Script from 'next/script' 
import "./globals.css"

// COMPONENTS
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

// TYPOGRAPHY: The "Swiss-Editorial" Combination
// 1. Sans: Clean, legible, invisible (Like Rolex/Cartier interfaces)
// FIX: Added display: 'swap' to resolve Turbopack build errors
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  weight: ["300", "400", "500", "600"], 
})

// 2. Serif: High-contrast, editorial (For "Maison" headlines)
// FIX: Added display: 'swap' to resolve Turbopack build errors
const serif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: 'swap',
  weight: ["400", "600", "700"],
  style: ['normal', 'italic'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // VISIBILITY LOGIC: Isolate the "App" experience from the "Maison" experience
  const currentPath = pathname || '';
  const isAuthPage = currentPath.startsWith('/auth');
  const isAdminPage = currentPath.startsWith('/admin');
  const isDashboardPage = currentPath.startsWith('/dashboard');
  const isCheckoutPage = currentPath.startsWith('/checkout');
  
  // Combine paths where the marketing header should be hidden
  const hideGlobalUI = isAuthPage || isAdminPage || isDashboardPage || isCheckoutPage;

  return (
    <html lang="en" className={`scroll-smooth ${serif.variable} ${sans.variable}`}>
      <head>
        {/* 3D RENDER ENGINE: For the interactive Vault Viewer */}
        <Script 
          type="module" 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js" 
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`
          antialiased 
          bg-ivory-100 
          text-obsidian-900 
          selection:bg-gold 
          selection:text-white
          overflow-x-hidden
          font-sans
        `}
      >
        {/* LUXURY TEXTURE: Subtle film grain overlay */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-[9999]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />

        {/* NAVIGATION: The "Maison" Header */}
        {!hideGlobalUI && <Navbar />}

        {/* MAIN STAGE */}
        <main className={`
          relative 
          ${hideGlobalUI ? 'min-h-screen' : 'min-h-screen pt-20'}
        `}>
          {children}
        </main>
        
        {/* FOOTER: The "Maison" Footer */}
        {!hideGlobalUI && <Footer />}
      </body>
    </html>
  );
}