'use client'

import { usePathname } from 'next/navigation'
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

// COMPONENTS
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// REFINED TYPOGRAPHY: Institutional weights for high visibility
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
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

  // GATEKEEPER LOGIC: Hide Global UI on Auth and Admin pages
  const currentPath = pathname || '';
  const isAuthPage = currentPath.startsWith('/auth');
  const isAdminPage = currentPath.startsWith('/admin');
  const hideGlobalUI = isAuthPage || isAdminPage;

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${serif.variable} 
          ${sans.variable} 
          antialiased 
          bg-ivory-100 
          text-obsidian-900 
          selection:bg-gold 
          selection:text-white
          overflow-x-hidden
        `}
      >
        {/* GLOBAL NAVIGATION */}
        {!hideGlobalUI && <Navbar />}

        {/* MAIN DISPLAY AREA */}
        <main className={`
          relative 
          ${hideGlobalUI ? 'z-50' : 'min-h-screen z-10 pt-16 md:pt-20'}
        `}>
          {children}
        </main>
        
        {/* SITE FOOTER */}
        {!hideGlobalUI && <Footer />}
      </body>
    </html>
  );
}