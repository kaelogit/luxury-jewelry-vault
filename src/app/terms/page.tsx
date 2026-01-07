'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Gavel, ArrowLeft, Zap, Scale, Landmark } from 'lucide-react'

export default function TermsOfSovereignty() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto space-y-32">
        
        {/* I. HEADER: THE MANDATE */}
        <header className="max-w-4xl space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
             <p className="label-caps text-gold">Operational Protocol</p>
          </div>
          <h1 className="text-6xl md:text-9xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Charter of <br/>
            <span className="text-gold not-italic">Sovereignty.</span>
          </h1>
          <div className="max-w-2xl border-l-2 border-gold pl-8 md:pl-12">
            <p className="text-xl md:text-2xl text-obsidian-600 font-medium leading-relaxed italic">
              Lume Vault is not a marketplace. It is a high-security bridge between digital liquidity and physical autonomy. By entering the vault, you adhere to these foundational mandates.
            </p>
          </div>
        </header>

        {/* II. THE ARTICLES */}
        <div className="space-y-20 border-t border-ivory-200 pt-20">
          <Article 
            number="01" 
            title="The Vault Mandate" 
            content="Lume Vault operates as a non-custodial gateway for ultra-high-value asset acquisition. We serve as the secure escrow agent, facilitating the transition of wealth into private, physical custody via cryptographic proof of settlement." 
          />
          <Article 
            number="02" 
            title="Settlement Protocol" 
            content="All transactions are finalized via immutable blockchain ledgers or confirmed bank wire. Once verification is complete, the legal title of the asset is transferred to the acquirer. Due to the nature of precious metals, all settlements are final." 
          />
          <Article 
            number="03" 
            title="Physical Verification" 
            content="Every asset undergoes a 3-tier audit: Independent GIA/LBMA appraisal, the creation of a digital twin, and climate-controlled deep-storage in our primary high-security nodes prior to release." 
          />
          <Article 
            number="04" 
            title="Private Logistics" 
            content="We maintain a proprietary chain of custody. No standard third-party couriers are utilized. Physical movement is handled via insured armored transit with coordinates managed through encrypted channels." 
          />
        </div>

        {/* III. FINALITY FOOTER */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-obsidian-900 rounded-2xl p-10 md:p-20 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 blur-[120px] pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row justify-between items-center gap-16 relative z-10">
            <div className="space-y-8 max-w-xl">
              <div className="flex items-center gap-4">
                <Gavel className="text-gold" size={24} />
                <h4 className="label-caps text-white">Finality of Transaction</h4>
              </div>
              <p className="text-lg text-ivory-300 leading-relaxed font-medium italic">
                By interacting with this registry, you acknowledge the absolute irreversibility of blockchain-based settlements and the physical nature of commodity-linked wealth preservation.
              </p>
            </div>
            
            <button 
              onClick={() => window.history.back()}
              className="px-16 py-6 bg-white text-obsidian-900 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-xl"
            >
              Acknowledge & Exit Protocol
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
        <h3 className="text-3xl font-medium font-serif italic text-obsidian-900 uppercase tracking-tight group-hover:text-gold transition-colors duration-500">
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