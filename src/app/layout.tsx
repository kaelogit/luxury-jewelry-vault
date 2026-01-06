'use client'

import { usePathname } from 'next/navigation'
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";

// COMPONENTS
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import SovereignIngress from '@/components/ui/SovereignIngress';

// REFINED TYPOGRAPHY: Heavier weights for better visibility
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"], // Removed 300, added 500/600 for clarity
  style: ['normal', 'italic'],
});

const sans = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "900"], // Bold 400-700 is now the baseline
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // II. THE GATEKEEPER LOGIC
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
          ${hideGlobalUI ? 'cursor-default' : ''}
        `}
      >
        {/* III. GLOBAL UI OVERLAYS */}
        {!hideGlobalUI && (
          <>
            <CustomCursor />
            <SovereignIngress />
            <Navbar />
          </>
        )}

        {/* IV. THE VAULT MAIN CONTAINER */}
        {/* Added dynamic padding-top for mobile when Navbar is present */}
        <main className={`
          relative 
          ${hideGlobalUI ? 'z-50' : 'min-h-screen z-10 pt-20 md:pt-0'}
        `}>
          {children}
        </main>
        
        {/* V. FINALITY */}
        {!hideGlobalUI && <Footer />}
      </body>
    </html>
  );
}