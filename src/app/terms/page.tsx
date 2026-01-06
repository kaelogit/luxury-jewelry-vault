'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Lock, Globe, Zap, ShieldCheck, Scale, Gavel } from 'lucide-react'

export default function TermsOfSovereignty() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-40 pb-32 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-5xl mx-auto space-y-32">
        
        {/* I. HEADER: The Constitutional Mandate */}
        <header className="space-y-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-4 px-6 py-2 bg-white border border-gold/20 rounded-full shadow-sm"
          >
            <ShieldCheck size={14} className="text-gold" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Foundational Protocol v2.0</span>
          </motion.div>
          
          <div className="space-y-6">
            <h1 className="text-7xl md:text-9xl font-light text-obsidian-900 italic tracking-tighter leading-[0.8]">
              Charter of <br/> <span className="text-obsidian-400 underline decoration-gold/20 underline-offset-8">Sovereignty.</span>
            </h1>
            <p className="text-obsidian-600 text-xl md:text-2xl font-light leading-relaxed italic border-l-2 border-gold pl-10">
              LUME VAULT is not a marketplace. It is a high-security bridge between digital liquidity and physical autonomy. By entering this vault, you adhere to our foundational mandates.
            </p>
          </div>
        </header>

        {/* II. THE ARTICLES: Detailed Legal Ingress */}
        <div className="space-y-24 border-t border-ivory-300 pt-24">
          <Section 
            number="01" 
            title="The Vault Mandate" 
            content="LUME VAULT operates as a non-custodial gateway for ultra-high-value asset acquisition. We serve as the secure escrow agent, facilitating the transition of wealth into private, physical custody via cryptographic proof of settlement." 
          />
          <Section 
            number="02" 
            title="Settlement Protocol" 
            content="All transactions are finalized via immutable blockchain ledgers. Prices are calculated live via the LUME Gold-Crypto Oracle. Once verification is complete, the legal title of the asset is transferred to the acquirer." 
          />
          <Section 
            number="03" 
            title="Physical Verification" 
            content="Every asset undergoes a 3-tier audit: Independent GIA/LBMA appraisal, the creation of a secure digital twin (Sovereign Certificate), and climate-controlled deep-storage in our primary high-security nodes." 
          />
          <Section 
            number="04" 
            title="Private Logistics" 
            content="We maintain a proprietary chain of custody. No third-party couriers are utilized. Physical movement is handled via insured armored transit with coordinates managed exclusively through encrypted ephemeral channels." 
          />
        </div>

        {/* III. LEGAL FINALITY FOOTER */}
        <motion.footer 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 bg-white border border-ivory-300 rounded-[4rem] shadow-2xl relative overflow-hidden group"
        >
          {/* Background Aura */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
            <div className="space-y-8 max-w-xl text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <Gavel className="text-gold" size={24} />
                <h4 className="text-[12px] font-black text-obsidian-900 uppercase tracking-[0.5em] italic">Finality of Transaction</h4>
              </div>
              <p className="text-[13px] text-obsidian-400 leading-relaxed font-bold uppercase tracking-[0.2em] italic opacity-80">
                By interacting with this registry, you acknowledge the absolute irreversibility of blockchain-based settlements and the physical nature of commodity-linked wealth preservation.
              </p>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="group relative bg-obsidian-900 text-gold px-16 py-8 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Acknowledge & Exit Protocol</span>
            </button>
          </div>
        </motion.footer>

      </div>
    </main>
  )
}

function Section({ number, title, content }: { number: string, title: string, content: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 group items-start">
      <div className="md:col-span-1">
        <span className="text-[14px] font-light text-gold italic border-b border-gold/20 pb-2 group-hover:text-obsidian-900 group-hover:border-gold transition-all duration-500 block">
          {number}.
        </span>
      </div>
      <div className="md:col-span-4">
        <h3 className="text-2xl font-light text-obsidian-900 italic uppercase tracking-tighter leading-tight group-hover:text-gold transition-colors duration-500">
          {title}
        </h3>
      </div>
      <div className="md:col-span-7">
        <p className="text-obsidian-500 text-lg font-medium leading-relaxed italic border-l border-ivory-300 pl-8 group-hover:border-gold transition-all duration-1000">
          {content}
        </p>
      </div>
    </div>
  )
}