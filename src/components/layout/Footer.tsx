'use client'

import React from 'react'
import Link from 'next/link'
import { ShieldCheck, ArrowUpRight, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6 md:px-12 relative overflow-hidden font-sans">
      
      {/* BRAND WATERMARK */}
      <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none hidden lg:block">
        <h2 className="text-[20vw] font-serif italic leading-none translate-y-[-20%] translate-x-[10%] text-black">Lume</h2>
      </div>

      <div className="max-w-screen-2xl mx-auto space-y-20 relative z-10">
        
        {/* I. TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
              <h3 className="text-3xl font-bold text-black font-serif italic tracking-tighter">
                Lume <span className="text-gold not-italic font-sans">Vault.</span>
              </h3>
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm font-medium">
              The premier destination for the acquisition and secure delivery of the world's most exceptional jewelry and investment assets.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Instagram size={18} />} href="https://instagram.com" />
              <SocialLink icon={<Twitter size={18} />} href="https://twitter.com" />
            </div>
          </div>

          {/* II. NAVIGATION */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-8">
            
            {/* SHOP */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Collection</h4>
              <ul className="space-y-4">
                <FooterLink href="/collection" label="View All" />
                <FooterLink href="/collection?category=Watches" label="Timepieces" />
                <FooterLink href="/collection?category=Diamonds" label="Diamonds" />
                <FooterLink href="/collection?category=Gold" label="Gold Bullion" />
              </ul>
            </div>

            {/* SUPPORT */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Support</h4>
              <ul className="space-y-4">
                <FooterLink href="/shipping" label="Shipping Policy" />
                <FooterLink href="/returns" label="Returns" />
                <FooterLink href="/track" label="Track Order" />
                <FooterLink href="/faq" label="FAQ" />
              </ul>
            </div>

            {/* COMPANY */}
            <div className="space-y-6 col-span-2 md:col-span-1">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Company</h4>
              <ul className="space-y-4">
                <FooterLink href="/story" label="About Lume" />
                <FooterLink href="/contact" label="Contact" />
                <FooterLink href="/terms" label="Terms of Service" />
                <FooterLink href="/privacy" label="Privacy Policy" />
              </ul>
            </div>
          </div>
        </div>

        {/* III. BOTTOM BAR */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-gold" />
            <span>&copy; {currentYear} Lume Vault International</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em]">
            <span>Zurich</span>
            <span>New York</span>
            <span>Dubai</span>
            <span>London</span>
            <span>Singapore</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <li>
      <Link 
        href={href} 
        className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-black hover:text-gold transition-colors duration-300"
      >
        {label}
        <ArrowUpRight size={10} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-gold" />
      </Link>
    </li>
  )
}

function SocialLink({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-black hover:border-gold hover:text-gold transition-all duration-300 bg-white"
    >
      {icon}
    </a>
  )
}