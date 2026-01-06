'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { EyeOff, ShieldAlert, Key, Database, RefreshCw, Lock, ShieldCheck, Fingerprint, Zap } from 'lucide-react'

const privacyProtocols = [
  {
    icon: <EyeOff size={24} />,
    title: "Zero-Knowledge Storage",
    desc: "We do not store your physical coordinates or Personally Identifiable Information (PII) on centralized ledgers. All logistics data is ephemeral and hardware-encrypted."
  },
  {
    icon: <Fingerprint size={24} />,
    title: "E2EE Communications",
    desc: "All concierge interactions are conducted via end-to-end encrypted (E2EE) channels. We facilitate PGP-signing for all high-value settlement negotiations."
  },
  {
    icon: <Database size={24} />,
    title: "Decentralized Liquidity",
    desc: "By settling via BTC, ETH, or USDC, you eliminate the banking surveillance metadata associated with legacy wire transfers and fiat footprints."
  },
  {
    icon: <RefreshCw size={24} />,
    title: "Automatic Purge Cycles",
    desc: "Transaction metadata is purged from our primary routing nodes exactly 24 hours after a 'Hand-Delivered' status is confirmed."
  }
]

export default function PrivacyProtocol() {
  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-24 px-6 md:px-12 selection:bg-gold selection:text-white">
      <div className="max-w-screen-xl mx-auto">
        
        {/* 1. THE MANIFESTO HEADER */}
        <header className="max-w-4xl mb-24 space-y-8">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_gold]" />
             <h3 className="text-[11px] uppercase tracking-[0.6em] text-gold font-black italic">
               Confidentiality Protocol
             </h3>
          </div>
          <h1 className="text-6xl md:text-9xl font-light text-obsidian-900 tracking-tighter italic leading-[0.8]">
            Privacy is <br/>
            <span className="text-obsidian-400 underline decoration-gold/20 underline-offset-8">Absolute.</span>
          </h1>
          <p className="text-obsidian-600 text-xl md:text-2xl font-light leading-relaxed max-w-2xl italic border-l-2 border-gold pl-10">
            LUME VAULT is architected on the principle of sovereign anonymity. We treat your data as a high-value asset, protected with the same rigor as the bullion in our vaults.
          </p>
        </header>

        {/* 2. THE PILLARS OF DISCRETION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
          {privacyProtocols.map((protocol, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-10 bg-white border border-ivory-300 rounded-[3rem] flex flex-col md:flex-row gap-8 items-start hover:border-gold/30 hover:shadow-2xl transition-all duration-700 group"
            >
              <div className="p-5 bg-ivory-50 border border-ivory-200 rounded-2xl text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-inner">
                {protocol.icon}
              </div>
              <div className="space-y-4">
                <h4 className="text-2xl font-light text-obsidian-900 italic tracking-tight">{protocol.title}</h4>
                <p className="text-[13px] text-obsidian-400 leading-relaxed font-bold uppercase tracking-widest italic opacity-80">
                  {protocol.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. LEGAL TERMINAL (THE COUNTER-SURVEILLANCE) */}
        <section className="bg-white border border-ivory-300 rounded-[4rem] p-10 md:p-20 space-y-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
          
          <div className="flex items-center gap-6 border-b border-ivory-200 pb-10">
            <ShieldAlert className="text-gold" size={24} />
            <h4 className="text-[12px] font-black uppercase tracking-[0.5em] text-obsidian-900 italic">Legal Counter-Surveillance Registry</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Zap size={14} className="text-gold" />
                 <span className="text-[10px] font-black text-obsidian-900 uppercase tracking-widest italic">Jurisdictional Node</span>
              </div>
              <p className="text-sm text-obsidian-400 leading-relaxed font-medium italic">
                Our primary data clusters operate in privacy-sovereign jurisdictions. We do not recognize or comply with informal data requests from extra-judicial third parties.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Zap size={14} className="text-gold" />
                 <span className="text-[10px] font-black text-obsidian-900 uppercase tracking-widest italic">Cookie Integrity</span>
              </div>
              <p className="text-sm text-obsidian-400 leading-relaxed font-medium italic">
                LUME VAULT utilizes zero tracking cookies. No pixels, no marketing aggregators, and no surveillance analytics. Your session remains an anonymous ghost.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <Zap size={14} className="text-gold" />
                 <span className="text-[10px] font-black text-obsidian-900 uppercase tracking-widest italic">Asset Provenance</span>
              </div>
              <p className="text-sm text-obsidian-400 leading-relaxed font-medium italic">
                To maintain physical anonymity, assets are held in the Vault Pool until the moment of handover. Your legal identity never appears on a public transit manifest.
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}