'use client'

import React from 'react'
import { ShieldCheck, Eye, Lock, Globe, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* I. HEADER */}
        <header className="space-y-6 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Legal</p>
          <h1 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Privacy <span className="text-gold not-italic">Policy.</span>
          </h1>
          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
            Your discretion is our highest priority. This policy outlines how we protect and manage the information you entrust to Lume Vault.
          </p>
        </header>

        {/* II. CONTENT BODY */}
        <div className="bg-white border border-ivory-300 rounded-[2.5rem] p-8 md:p-16 shadow-sm space-y-16">
          
          {/* Section 1 */}
          <PrivacySection 
            icon={<Eye size={20} />}
            title="Information Collection"
            content="To provide a personalized acquisition experience, we collect information you provide directly to us—such as your name, contact details, and shipping preferences. For high-valuation items, identity verification is required."
          />

          {/* Section 2 */}
          <PrivacySection 
            icon={<ShieldCheck size={20} />}
            title="Data Usage"
            content="We use your information exclusively to process orders, facilitate private logistics, and communicate regarding your acquisitions. We do not sell or trade your personal data with third-party marketing entities."
          />

          {/* Section 3 */}
          <PrivacySection 
            icon={<Lock size={20} />}
            title="Security Architecture"
            content="Our digital vault leverages end-to-end encryption. All payment information is processed through secure, encrypted nodes. We maintain rigorous safeguards to protect your privacy at every stage."
          />

          {/* Section 4 */}
          <PrivacySection 
            icon={<Globe size={20} />}
            title="Global Compliance"
            content="Lume Vault adheres to international data protection standards, including GDPR and CCPA. You have the right to request access to your data, correction of inaccuracies, or complete removal from our registry."
          />

          {/* III. QUICK LINKS */}
          <div className="pt-12 border-t border-ivory-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-obsidian-900 uppercase tracking-wide">Data Concerns</h4>
              <p className="text-xs text-obsidian-500 font-medium">Questions regarding your data security?</p>
            </div>
            <Link 
              href="/contact"
              className="px-10 py-4 bg-obsidian-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-obsidian-900 transition-all shadow-lg flex items-center gap-3 active:scale-95"
            >
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* IV. FOOTER */}
        <footer className="text-center">
          <p className="text-[10px] font-bold text-obsidian-300 uppercase tracking-[0.2em]">
            Last Updated: January 2026 • Lume Vault International
          </p>
        </footer>
      </div>
    </main>
  )
}

function PrivacySection({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 group">
      <div className="md:col-span-4 flex items-start gap-4">
        <div className="w-12 h-12 bg-ivory-50 border border-ivory-200 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shrink-0 shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-serif italic text-obsidian-900 pt-2">{title}</h3>
      </div>
      <div className="md:col-span-8">
        <p className="text-sm md:text-base text-obsidian-600 leading-relaxed font-medium pt-1">
          {content}
        </p>
      </div>
    </div>
  )
}