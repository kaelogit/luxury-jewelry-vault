'use client'

import React from 'react'
import { Lock, EyeOff, ShieldCheck, Fingerprint, Landmark, Map, Briefcase, Key } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityStandards() {
  return (
    <section className="py-24 px-6 md:px-12 bg-ivory-100">
      <div className="max-w-screen-2xl mx-auto bg-white border border-ivory-300 rounded-[3rem] p-10 md:p-24 overflow-hidden relative shadow-sm group">
        
        {/* Subtle Gold Aura */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          
          {/* I. NARRATIVE: The Philosophy of Discretion */}
          <div className="space-y-10">
            <div className="flex items-center gap-3">
               <ShieldCheck className="text-gold" size={18} />
               <p className="label-caps text-gold">The Lume Protocol</p>
            </div>
            
            <h2 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-[0.9]">
              The Art of <br/> 
              <span className="text-gold not-italic">Invisible</span> <br/>
              Protection.
            </h2>

            <div className="max-w-md border-l-2 border-gold pl-8">
              <p className="text-xl text-obsidian-600 font-medium leading-relaxed italic">
                Lume Vault operates beyond the reach of traditional systems. By merging boutique physical vaulting with silent cryptographic seals, we ensure your acquisitions remain absolute, unseen, and entirely yours.
              </p>
            </div>
          </div>

          {/* II. FEATURE GRID: Rebuilt with Luxury Terminology */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SecurityFeature 
              icon={<Landmark size={20}/>} 
              title="Boutique Vaulting" 
              desc="Assets are housed in climate-perfect, off-registry nodes designed for absolute physical preservation."
            />
            <SecurityFeature 
              icon={<Key size={20}/>} 
              title="Sacred Keys" 
              desc="Your identity is decoupled from your assets, using private-key architecture to ensure a truly anonymous lineage."
            />
            <SecurityFeature 
              icon={<EyeOff size={20}/>} 
              title="Quiet Settlement" 
              desc="Direct acquisition paths bypass legacy financial eyes, leaving no public metadata or digital breadcrumbs."
            />
            <SecurityFeature 
              icon={<Map size={20}/>} 
              title="Concierge Handover" 
              desc="A private logistics chain mobilizes instantly, maintaining an unbroken line of custody to your door."
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
        <p className="text-[11px] text-obsidian-500 font-bold uppercase tracking-widest leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}