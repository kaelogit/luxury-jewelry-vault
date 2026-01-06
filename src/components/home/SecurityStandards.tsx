'use client'

import React from 'react'
import { Lock, Cpu, EyeOff, Radio, ShieldCheck, Fingerprint } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityStandards() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-12 bg-ivory-100 selection:bg-gold selection:text-white">
      <div className="max-w-screen-2xl mx-auto bg-white border border-ivory-300 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 overflow-hidden relative shadow-sm group">
        
        {/* Institutional Glow Overlay */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-1000" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 relative z-10">
          
          {/* I. NARRATIVE: The Sovereign Charter */}
          <div className="max-w-xl space-y-8 md:space-y-12">
            <div className="flex items-center gap-4">
               <Fingerprint className="text-gold" size={18} />
               <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black italic">
                 Institutional Infrastructure
               </h3>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-light text-obsidian-900 leading-[0.9] tracking-tighter italic">
              Built for <br/> 
              <span className="text-obsidian-400 not-italic">Private </span> 
              <span className="text-obsidian-900 underline decoration-gold/20 underline-offset-8">Sovereignty.</span>
            </h2>

            <p className="text-obsidian-600 text-lg font-medium leading-relaxed italic border-l-2 border-gold/30 pl-8 max-w-md">
              LUME VAULT operates on a <span className="text-obsidian-900 font-bold border-b border-gold/20">zero-trust protocol</span>. 
              We leverage Tier-4 deep storage and P2P cryptographic settlement to ensure acquisitions remain absolute, untraceable, and under your private control.
            </p>
          </div>

          {/* II. FEATURE GRID: Technical Mandates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityFeature 
              icon={<Lock size={20}/>} 
              title="Cold Storage" 
              desc="Physical assets held in climate-controlled Tier-4 deep-earth nodes."
            />
            <SecurityFeature 
              icon={<Cpu size={20}/>} 
              title="Encrypted Ingress" 
              desc="AES-256 encrypted dialogue for all concierge-level acquisitions."
            />
            <SecurityFeature 
              icon={<EyeOff size={20}/>} 
              title="Zero-Footprint" 
              desc="Direct on-chain settlement. No legacy banking trail or audit history."
            />
            <SecurityFeature 
              icon={<Radio size={20}/>} 
              title="Mempool Ops" 
              desc="Real-time settlement monitoring for immediate logistical release."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function SecurityFeature({ icon, title, desc }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group space-y-6 p-8 bg-ivory-50 border border-ivory-200 rounded-[2.5rem] transition-all duration-700 hover:bg-white hover:border-gold/30 hover:shadow-2xl"
    >
      <div className="w-12 h-12 rounded-2xl bg-white border border-ivory-300 flex items-center justify-center text-obsidian-300 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-700 shadow-sm">
        {icon}
      </div>
      
      <div className="space-y-3">
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-obsidian-900 italic">
          {title}
        </h4>
        <p className="text-[10px] text-obsidian-400 leading-relaxed font-bold uppercase tracking-widest group-hover:text-obsidian-600 transition-colors">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}