'use client'

import React from 'react'
import { Lock, Cpu, EyeOff, Radio, ShieldCheck, Fingerprint, Landmark, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityStandards() {
  return (
    <section className="py-24 px-6 md:px-12 bg-ivory-100">
      <div className="max-w-screen-2xl mx-auto bg-white border border-ivory-300 rounded-[3rem] p-10 md:p-24 overflow-hidden relative shadow-sm group">
        
        {/* Subtle Institutional Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* I. NARRATIVE */}
          <div className="space-y-10">
            <div className="flex items-center gap-3">
               <Fingerprint className="text-gold" size={18} />
               <p className="label-caps text-gold">Institutional Infrastructure</p>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
              Built for <br/> 
              <span className="text-gold not-italic">Private</span> <br/>
              Sovereignty.
            </h2>

            <div className="max-w-md border-l-2 border-gold pl-8">
              <p className="text-xl text-obsidian-600 font-medium leading-relaxed italic">
                Lume Vault operates on a zero-trust protocol. We leverage Tier-4 deep storage and direct cryptographic settlement to ensure acquisitions remain absolute and under your private control.
              </p>
            </div>
          </div>

          {/* II. FEATURE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityFeature 
              icon={<Landmark size={20}/>} 
              title="Cold Storage" 
              desc="Assets held in climate-controlled Tier-4 deep-earth nodes."
            />
            <SecurityFeature 
              icon={<Lock size={20}/>} 
              title="AES-256 Vault" 
              desc="Military-grade encryption for all private advisory channels."
            />
            <SecurityFeature 
              icon={<EyeOff size={20}/>} 
              title="Zero-Footprint" 
              desc="On-chain settlement eliminates legacy banking metadata."
            />
            <SecurityFeature 
              icon={<Zap size={20}/>} 
              title="Real-Time Sync" 
              desc="Immediate logistical release upon node confirmation."
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
      className="p-10 bg-ivory-50 border border-ivory-200 rounded-2xl transition-all duration-500 hover:bg-white hover:border-gold/30 hover:shadow-xl group"
    >
      <div className="w-14 h-14 rounded-xl bg-white border border-ivory-200 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm mb-8">
        {icon}
      </div>
      
      <div className="space-y-3">
        <h4 className="text-lg font-medium font-serif italic text-obsidian-900 uppercase tracking-tight">
          {title}
        </h4>
        <p className="text-xs text-obsidian-500 font-medium leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}