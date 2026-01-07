'use client'

import React from 'react'
import Link from 'next/link'
import { Twitter, Instagram, ArrowUp, Mail, Facebook } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-ivory-100 border-t border-ivory-300 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* I. THE MAIN COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* COLUMN 1: BRAND & NEWSLETTER (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
               <h2 className="text-2xl font-medium tracking-tight text-obsidian-900 uppercase font-serif italic">
                 Lume <span className="text-gold not-italic">Vault</span>
               </h2>
               <p className="text-sm text-obsidian-600 leading-relaxed max-w-sm">
                 A curated destination for exceptional timepieces and high-karat gold jewelry. Designed for those who appreciate the intersection of heritage and modern luxury.
               </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="label-caps !tracking-[0.2em] text-obsidian-900">Join the Collection</h4>
              <form className="relative max-w-sm group">
                 <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full bg-white border border-ivory-300 rounded-lg py-4 px-5 text-sm outline-none focus:border-gold transition-all shadow-sm"
                 />
                 <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-400 group-hover:text-gold transition-colors">
                    <Mail size={18} strokeWidth={1.5} />
                 </button>
              </form>
            </div>
          </div>

          {/* COLUMN 2: SHOP (2 Cols) */}
          <div className="lg:col-span-2 space-y-6 lg:ml-auto">
            <h4 className="label-caps !tracking-[0.2em] text-obsidian-900">Shop</h4>
            <ul className="space-y-3">
              <FooterLink href="/collection" label="All Collections" />
              <FooterLink href="/collection?cat=watches" label="Watches" />
              <FooterLink href="/collection?cat=jewelry" label="Fine Jewelry" />
              <FooterLink href="/collection?cat=best-sellers" label="Best Sellers" />
            </ul>
          </div>

          {/* COLUMN 3: CLIENT CARE (3 Cols) */}
          <div className="lg:col-span-3 space-y-6 lg:ml-auto">
            <h4 className="label-caps !tracking-[0.2em] text-obsidian-900">Client Care</h4>
            <ul className="space-y-3">
              <FooterLink href="/shipping" label="Shipping & Logistics" />
              <FooterLink href="/returns" label="Returns & Exchanges" />
              <FooterLink href="/tracking" label="Track Your Order" />
              <FooterLink href="/faq" label="Common Questions" />
              <FooterLink href="/concierge" label="Bespoke Service" />
            </ul>
          </div>

          {/* COLUMN 4: COMPANY (3 Cols) */}
          <div className="lg:col-span-3 space-y-6 lg:ml-auto">
            <h4 className="label-caps !tracking-[0.2em] text-obsidian-900">Company</h4>
            <ul className="space-y-3">
              <FooterLink href="/about" label="Our Story" />
              <FooterLink href="/terms" label="Terms of Service" />
              <FooterLink href="/privacy" label="Privacy Policy" />
              <FooterLink href="/contact" label="Contact Us" />
            </ul>
            
            <div className="flex gap-4 pt-4">
               <SocialLink icon={<Instagram size={18} strokeWidth={1.5} />} />
               <SocialLink icon={<Twitter size={18} strokeWidth={1.5} />} />
               <SocialLink icon={<Facebook size={18} strokeWidth={1.5} />} />
            </div>
          </div>
        </div>

        {/* II. THE SUB-FOOTER */}
        <div className="pt-8 border-t border-ivory-300 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">
            © 2026 LUME VAULT. ALL RIGHTS RESERVED.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[10px] font-bold text-obsidian-900 uppercase tracking-widest hover:text-gold transition-colors"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label }: { href: string, label: string }) {
  return (
    <li>
      <Link href={href} className="text-[11px] font-medium text-obsidian-600 hover:text-gold transition-colors">
        {label}
      </Link>
    </li>
  )
}

function SocialLink({ icon }: { icon: any }) {
  return (
    <button className="text-obsidian-400 hover:text-gold transition-colors">
      {icon}
    </button>
  )
}