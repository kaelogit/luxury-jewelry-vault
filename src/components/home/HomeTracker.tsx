'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, ArrowRight, Fingerprint, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomeTracker() {
  const [orderId, setOrderId] = useState('')
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return
    router.push(`/protocol/tracking?id=${orderId.toUpperCase()}`)
  }

  return (
    <section className="py-12 md:py-20 px-6 bg-ivory-100 selection:bg-gold selection:text-white">
      <motion.div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`max-w-5xl mx-auto border rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-16 relative overflow-hidden transition-all duration-1000 ${
          isHovered ? 'border-gold/30 bg-white shadow-2xl' : 'border-ivory-300 bg-white/50 shadow-sm'
        }`}
      >
        {/* Institutional Glow Overlay */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-1000" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* I. NARRATIVE: The Verification Command */}
          <div className="space-y-6 text-center lg:text-left max-w-sm">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <Fingerprint size={18} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Logistics Protocol</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light text-obsidian-900 italic tracking-tighter leading-[0.8]">
              Verify <br/> <span className="text-obsidian-400">Transit.</span>
            </h2>
            <p className="text-[10px] text-obsidian-300 font-bold uppercase tracking-[0.2em] leading-relaxed">
              Access the real-time manifest and chain of custody for your sovereign acquisition.
            </p>
          </div>

          {/* II. INTERACTION: The Handshake Terminal */}
          <form onSubmit={handleQuickSearch} className="w-full lg:w-auto flex flex-col sm:flex-row gap-6 items-center">
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                placeholder="LV-REGISTRY-ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-ivory-50 border border-ivory-300 rounded-2xl py-6 px-8 text-obsidian-900 font-mono text-sm outline-none focus:border-gold focus:bg-white transition-all placeholder:text-ivory-300 shadow-inner"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Globe size={12} className="text-gold/30 animate-pulse" />
              </div>
            </div>
            
            <button className="group relative h-[68px] px-12 bg-obsidian-900 text-gold rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all duration-700 flex items-center justify-center gap-4 active:scale-95 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Authenticate</span> 
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            </button>
          </form>
        </div>

        {/* III. SECURITY FOOTER */}
        <div className="mt-12 pt-8 border-t border-ivory-100 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
           <div className="flex items-center gap-3">
              <ShieldCheck size={14} className="text-gold" />
              <p className="text-[9px] font-bold text-obsidian-900 uppercase tracking-[0.3em]">
                E2E Encrypted Registry Monitoring
              </p>
           </div>
           <p className="text-[9px] font-mono text-obsidian-300 uppercase tracking-widest italic">
             Escort Node: Active / Global
           </p>
        </div>
      </motion.div>
    </section>
  )
}