'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, ShieldCheck, UserCheck, Globe, Fingerprint } from 'lucide-react'

export default function ConciergeCall() {
  return (
    <section id="concierge" className="py-20 md:py-24 px-6 md:px-12 bg-ivory-100 border-t border-ivory-300 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left Side: The Narrative Protocol */}
        <div className="space-y-8 md:space-y-10">
          <div className="flex items-center gap-3">
             <Fingerprint className="text-gold" size={18} />
             <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black italic">
               Sovereign Desk
             </h3>
          </div>

          <h2 className="text-5xl md:text-8xl font-light text-obsidian-900 leading-[0.9] tracking-tighter italic">
            Acquire with <br/> 
            <span className="text-obsidian-400 not-italic">Absolute</span> <br/>
            <span className="text-obsidian-900 underline decoration-gold/20 underline-offset-8">Discretion.</span>
          </h2>

          <p className="text-obsidian-600 text-lg md:text-xl font-medium leading-relaxed max-w-md italic border-l-2 border-gold/30 pl-8">
            For acquisitions exceeding $50,000, we initiate an encrypted sovereign protocol. 
            No legacy banking delays. No third-party exposure. Pure physical settlement.
          </p>
          
          <div className="pt-4 md:pt-8">
            <button className="group relative bg-obsidian-900 text-gold px-12 py-7 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all duration-700 flex items-center gap-6 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Initialize Private Protocol</span>
              <MessageSquare size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: The 3-Step Protocol Audit */}
        <div className="space-y-12 md:space-y-16">
          <ProtocolStep 
            number="01" 
            icon={<ShieldCheck size={20} />} 
            title="Proof of Intent" 
            desc="Verification of digital liquidity via signed message. We ensure every participant is a sovereign actor."
          />
          <ProtocolStep 
            number="02" 
            icon={<UserCheck size={20} />} 
            title="Encrypted Dialogue" 
            desc="Direct E2E line with our lead custodian to finalize specifications through our secure private desk."
          />
          <ProtocolStep 
            number="03" 
            icon={<Globe size={20} />} 
            title="Armored Ingress" 
            desc="Fully insured transit via private armored courier to your precise global coordinates. No standard post."
          />
        </div>

      </div>
    </section>
  )
}

function ProtocolStep({ number, icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex gap-8 md:gap-12 group"
    >
      <div className="text-gold/20 text-5xl md:text-6xl font-light italic group-hover:text-gold transition-colors duration-1000 select-none font-serif">
        {number}
      </div>
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white border border-ivory-300 rounded-xl text-gold group-hover:bg-gold group-hover:text-white transition-all shadow-sm">
            {icon}
          </div>
          <h4 className="text-xl font-light italic text-obsidian-900 tracking-tighter">{title}</h4>
        </div>
        <p className="text-[11px] text-obsidian-400 leading-relaxed font-bold uppercase tracking-[0.2em] max-w-sm group-hover:text-obsidian-900 transition-colors">
          {desc}
        </p>
      </div>
    </motion.div>
  )
}