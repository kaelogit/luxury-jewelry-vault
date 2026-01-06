'use client'

import React from 'react'
import Link from 'next/link'
import { Shield, Lock, Globe, Twitter, Instagram, ArrowUp, Fingerprint, Mail } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-ivory-100 border-t border-ivory-300 pt-24 pb-12 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* I. TOP SECTION: Lead Capture & Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          
          {/* Brand & Manifesto (5 Columns) */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
               <h2 className="text-2xl font-light tracking-tighter text-obsidian-900 italic uppercase">
                 Lume <span className="text-obsidian-400">Vault.</span>
               </h2>
               <div className="h-[1px] w-12 bg-gold/40" />
            </div>
            <p className="text-sm text-obsidian-600 leading-relaxed font-medium italic max-w-sm">
              The premier sovereign gateway for the conversion of digital capital into high-ticket physical assets. Fully audited. Fully secure. Worldwide delivery via armored logistics.
            </p>
            <div className="flex gap-4 pt-4">
              <SocialIcon icon={<Twitter size={16}/>} />
              <SocialIcon icon={<Instagram size={16}/>} />
            </div>
          </div>

          {/* Institutional Newsletter (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic">Member Newsletter</h4>
            <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest leading-relaxed">
              Receive private notifications regarding off-market acquisitions and bespoke horological releases.
            </p>
            <form className="relative max-w-sm">
               <input 
                type="email" 
                placeholder="REGISTRY@EMAIL.COM" 
                className="w-full bg-white border border-ivory-300 rounded-2xl py-5 px-6 text-[10px] font-mono outline-none focus:border-gold transition-all shadow-inner"
               />
               <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gold hover:text-obsidian-900 transition-colors">
                  <Mail size={16} />
               </button>
            </form>
          </div>

          {/* Quick Registry Ingress (3 Columns) */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-obsidian-900">Vault</h4>
              <ul className="space-y-3">
                <FooterLink label="Bullion" />
                <FooterLink label="Diamonds" />
                <FooterLink label="Watches" />
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-obsidian-900">Protocol</h4>
              <ul className="space-y-3">
                <FooterLink label="Concierge" />
                <FooterLink label="Tracking" />
                <FooterLink label="Terms" />
              </ul>
            </div>
          </div>
        </div>

        {/* II. MID SECTION: Trust Verification Seals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
           <TrustSeal icon={<Shield size={14} />} label="LBMA Audited" />
           <TrustSeal icon={<Fingerprint size={14} />} label="GIA Certified" />
           <TrustSeal icon={<Lock size={14} />} label="On-Chain Escrow" />
           <TrustSeal icon={<Globe size={14} />} label="Global Logistics" />
        </div>

        {/* III. BOTTOM BAR: Copyright & Finality */}
        <div className="pt-10 border-t border-ivory-300 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
             <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic">
               © 2026 LUME VAULT • SOVEREIGN REGISTRY ACTIVE
             </p>
          </div>
          
          <div className="flex gap-10 items-center">
            <Link href="/privacy" className="text-[9px] font-black text-obsidian-400 uppercase tracking-widest hover:text-gold transition-colors italic">Privacy Protocol</Link>
            <Link href="/terms" className="text-[9px] font-black text-obsidian-400 uppercase tracking-widest hover:text-gold transition-colors italic">Terms of Sovereignty</Link>
            <button 
              onClick={scrollToTop}
              className="w-10 h-10 border border-ivory-300 bg-white rounded-full flex items-center justify-center text-obsidian-300 hover:border-gold hover:text-gold transition-all active:scale-90 shadow-sm"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ label }: { label: string }) {
  return (
    <li>
      <Link href="#" className="text-[10px] font-black text-obsidian-400 uppercase tracking-[0.2em] hover:text-gold transition-colors">
        {label}
      </Link>
    </li>
  )
}

function TrustSeal({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="p-4 border border-ivory-300 rounded-2xl bg-white flex items-center justify-center gap-3 shadow-sm hover:border-gold/30 transition-all cursor-default">
      <div className="text-gold">{icon}</div>
      <span className="text-[9px] font-black text-obsidian-400 uppercase tracking-[0.3em] italic">{label}</span>
    </div>
  )
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <div className="w-10 h-10 border border-ivory-300 bg-white rounded-full flex items-center justify-center text-obsidian-400 hover:border-gold hover:text-gold transition-all cursor-pointer shadow-sm">
      {icon}
    </div>
  )
}