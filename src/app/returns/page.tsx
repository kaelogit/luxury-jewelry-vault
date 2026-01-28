'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RefreshCcw, ShieldCheck, PackageCheck, ArrowRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-20 px-6 md:px-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
        
        {/* I. HEADER */}
        <header className="space-y-6 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Service Guarantee</p>
          <h1 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Returns & <br/> <span className="text-gold not-italic">Exchanges.</span>
          </h1>
          <p className="text-obsidian-600 text-lg md:text-xl leading-relaxed font-medium max-w-2xl">
            Your satisfaction is essential. If your acquisition does not meet your expectations, we offer a streamlined process for returns.
          </p>
        </header>

        {/* II. HIGHLIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <HighlightCard 
            icon={<RefreshCcw size={20} />}
            title="14-Day Window"
            desc="Requests must be initiated within 14 days of delivery."
          />
          <HighlightCard 
            icon={<ShieldCheck size={20} />}
            title="Secure Pickup"
            desc="We arrange fully insured courier collection for all returns."
          />
          <HighlightCard 
            icon={<PackageCheck size={20} />}
            title="Full Refund"
            desc="Refunds are processed after quality inspection."
          />
        </div>

        {/* III. POLICY BODY */}
        <div className="bg-white border border-ivory-300 rounded-[2.5rem] p-8 md:p-16 shadow-sm space-y-16">
          
          <PolicySection 
            title="Conditions"
            content="To be eligible for a return, the item must be in its original, unworn condition with all protective seals, tags, and security packaging intact. All original documentation, including GIA certificates, must be returned."
          />

          <PolicySection 
            title="Exclusions"
            content="Bespoke commissions, personalized engravings, and items marked as 'Final Sale' are not eligible for return or exchange. These items are crafted specifically to your requirements."
          />

          <PolicySection 
            title="The Process"
            content="1. Contact our concierge to initiate a Return Request. 2. A secure shipping label will be provided. 3. Schedule a pickup with our specialized courier. 4. Upon receipt, our gemologists will perform a quality audit before your refund is issued."
          />

          {/* IV. SECURITY NOTICE */}
          <div className="bg-ivory-50 border border-gold/20 p-6 md:p-8 rounded-3xl flex gap-5 items-start">
            <AlertCircle className="text-gold shrink-0 mt-1" size={24} />
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-obsidian-900">Security Note</h4>
              <p className="text-xs text-obsidian-600 leading-relaxed font-medium">
                For security reasons, returns sent without a prior Return Request or via unauthorized couriers will be refused. Lume Vault is not responsible for items lost in unauthorized transit.
              </p>
            </div>
          </div>

          {/* V. CONTACT FOOTER */}
          <div className="pt-12 border-t border-ivory-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-bold text-obsidian-900 uppercase tracking-wide">Ready to start?</h4>
              <p className="text-xs text-obsidian-500 font-medium">Speak with a specialist to begin your return.</p>
            </div>
            <Link 
              href="/contact"
              className="w-full md:w-auto px-10 py-4 bg-obsidian-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gold hover:text-obsidian-900 transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95"
            >
              Contact Concierge <ArrowRight size={14} />
            </Link>
          </div>

        </div>

        {/* VI. FOOTER */}
        <footer className="text-center">
          <p className="text-[10px] font-bold text-obsidian-300 uppercase tracking-[0.2em]">
            Global Policy • Effective Jan 2026
          </p>
        </footer>
      </div>
    </main>
  )
}

function HighlightCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white border border-ivory-300 rounded-3xl p-8 space-y-4 shadow-sm hover:border-gold transition-colors duration-500">
      <div className="w-12 h-12 bg-ivory-50 rounded-2xl flex items-center justify-center text-gold border border-ivory-100">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-obsidian-900">{title}</h4>
        <p className="text-[11px] text-obsidian-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function PolicySection({ title, content }: { title: string, content: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12">
      <div className="md:col-span-4">
        <h3 className="text-xl font-serif italic text-obsidian-900">{title}</h3>
      </div>
      <div className="md:col-span-8">
        <p className="text-sm md:text-base text-obsidian-600 leading-relaxed font-medium">
          {content}
        </p>
      </div>
    </div>
  )
}