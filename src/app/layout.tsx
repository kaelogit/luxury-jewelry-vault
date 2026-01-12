'use client'

import { usePathname } from 'next/navigation'
import { Libre_Baskerville, Montserrat } from "next/font/google";
import Script from 'next/script' 
import "./globals.css";

// COMPONENTS
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// TYPOGRAPHY: Elegant fonts for the Lume Vault experience
const serif = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ['normal', 'italic'],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // VISIBILITY LOGIC: Hide Global Navbar/Footer on Auth, Admin, and User Dashboard pages
  const currentPath = pathname || '';
  const isAuthPage = currentPath.startsWith('/auth');
  const isAdminPage = currentPath.startsWith('/admin');
  const isDashboardPage = currentPath.startsWith('/dashboard'); // Added this check
  
  // Combine all paths that should NOT show the main website header/footer
  const hideGlobalUI = isAuthPage || isAdminPage || isDashboardPage;

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* 3D ENGINE: Supports the interactive item viewer */}
        <Script 
          type="module" 
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js" 
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`
          ${serif.variable} 
          ${sans.variable} 
          antialiased 
          bg-white 
          text-black 
          selection:bg-gold 
          selection:text-white
          overflow-x-hidden
        `}
      >
        {/* MAIN WEBSITE NAVIGATION: Only visible on public store pages */}
        {!hideGlobalUI && <Navbar />}

        {/* CONTENT AREA */}
        <main className={`
          relative 
          ${hideGlobalUI ? 'z-50 min-h-screen' : 'min-h-screen z-10 pt-16 md:pt-20'}
        `}>
          {children}
        </main>
        
        {/* MAIN WEBSITE FOOTER: Only visible on public store pages */}
        {!hideGlobalUI && <Footer />}
      </body>
    </html>
  );
}