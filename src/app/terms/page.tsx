'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Gavel, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 md:px-12 font-sans">
      <div className="max-w-screen-2xl mx-auto space-y-32">
        
        {/* I. HEADER */}
        <header className="max-w-4xl space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-gold rounded-full" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Legal Agreement</p>
          </div>
          <h1 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Terms of <br/>
            <span className="text-gold not-italic">Service.</span>
          </h1>
          <div className="max-w-2xl border-l-2 border-gold pl-8 md:pl-12">
            <p className="text-xl md:text-2xl text-obsidian-600 font-medium leading-relaxed italic">
              Lume Vault provides a secure platform for high-value asset acquisition. By accessing our services, you agree to the following terms and conditions.
            </p>
          </div>
        </header>

        {/* II. ARTICLES */}
        <div className="space-y-20 border-t border-ivory-200 pt-20">
          <Article 
            number="01" 
            title="Service Overview" 
            content="Lume Vault operates as a secure retailer for luxury assets. We facilitate the sale, insurance, and delivery of high-value items to verified clients globally." 
          />
          <Article 
            number="02" 
            title="Payment & Settlement" 
            content="All transactions must be settled via authorized payment methods. Ownership title is transferred only upon full confirmation of funds. All sales are subject to availability and final verification." 
          />
          <Article 
            number="03" 
            title="Verification Process" 
            content="For security purposes, high-value transactions may require additional identity verification. Lume Vault reserves the right to cancel orders that do not meet our security criteria." 
          />
          <Article 
            number="04" 
            title="Liability & Insurance" 
            content="We provide comprehensive insurance coverage for all items during transit. Our liability ends upon confirmed delivery signature at the designated shipping address." 
          />
        </div>

        {/* III. FOOTER */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-obsidian-900 rounded-[2.5rem] p-10 md:p-20 text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
            <div className="space-y-8 max-w-xl">
              <div className="flex items-center gap-4">
                <Gavel className="text-gold" size={24} />
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Agreement Acceptance</h4>
              </div>
              <p className="text-lg text-ivory-300 leading-relaxed font-medium italic">
                By using this site, you acknowledge that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="px-12 py-5 bg-white text-obsidian-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95"
            >
              Back to Site
            </button>
          </div>
        </motion.footer>

      </div>
    </main>
  )
}

function Article({ number, title, content }: { number: string, title: string, content: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 group">
      <div className="md:col-span-1">
        <span className="text-lg font-serif italic text-gold border-b border-gold/20 pb-2 block">
          {number}.
        </span>
      </div>
      <div className="md:col-span-4">
        <h3 className="text-2xl md:text-3xl font-medium font-serif italic text-obsidian-900 uppercase tracking-tight group-hover:text-gold transition-colors duration-500">
          {title}
        </h3>
      </div>
      <div className="md:col-span-7">
        <p className="text-obsidian-500 text-lg font-medium leading-relaxed italic border-l border-ivory-200 pl-8 group-hover:border-gold transition-all duration-700">
          {content}
        </p>
      </div>
    </div>
  )
}