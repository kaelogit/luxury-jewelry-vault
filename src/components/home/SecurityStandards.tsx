'use client'

import React from 'react'
import { EyeOff, ShieldCheck, Landmark, Map, Key } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SecurityStandards() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-12 bg-ivory-100 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-screen-2xl mx-auto bg-white border border-ivory-300 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 lg:p-24 overflow-hidden relative shadow-sm"
      >
        
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gold/5 blur-[80px] md:blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start relative z-10">
          
          {/* I. NARRATIVE SECTION */}
          <div className="space-y-8 md:sticky md:top-10">
            <div className="flex items-center gap-3">
               <ShieldCheck className="text-gold" size={16} />
               <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Security Standards</p>
            </div>
            
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tighter leading-[0.95] md:leading-[0.9]">
              Uncompromising <br/> 
              <span className="text-gold not-italic">Security.</span>
            </h2>

            <div className="max-w-md border-l-2 border-gold/30 pl-6 md:pl-8">
              <p className="text-lg md:text-xl text-obsidian-600 font-medium leading-relaxed italic">
                Lume Vault works differently. We combine physical bank-grade vaults with digital encryption to keep your items safe, private, and yours.
              </p>
            </div>
          </div>

          {/* II. FEATURE MODULES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <SecurityFeature 
              icon={<Landmark size={20}/>} 
              title="Private Vaulting" 
              desc="Your items stay in climate-controlled, off-site vaults built for perfect preservation."
              delay={0.1}
            />
            <SecurityFeature 
              icon={<Key size={20}/>} 
              title="Private Identity" 
              desc="Your personal details are encrypted. We ensure your business remains your business."
              delay={0.2}
            />
            <SecurityFeature 
              icon={<EyeOff size={20}/>} 
              title="Secure Payments" 
              desc="Safe acquisition paths that keep your financial records private and secure."
              delay={0.3}
            />
            <SecurityFeature 
              icon={<Map size={20}/>} 
              title="Global Logistics" 
              desc="A private shipping chain that moves quickly and keeps your items safe until they reach you."
              delay={0.4}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function SecurityFeature({ icon, title, desc, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -5 }}
      className="p-8 md:p-10 bg-ivory-50/50 border border-ivory-200 rounded-[2rem] transition-all duration-500 hover:bg-white hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 group"
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-ivory-200 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-sm mb-6 md:mb-8">
        {icon}
      </div>
      
      <div className="space-y-3">
        <h4 className="text-xl font-medium font-serif italic text-obsidian-900 tracking-tight">
          {title}
        </h4>
        <p className="text-[10px] md:text-[11px] text-obsidian-500 font-bold uppercase tracking-widest leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}