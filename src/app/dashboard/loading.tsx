'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      
      {/* BACKGROUND: Subtle Gold Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 px-6">
        
        {/* LOADER ICON */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 bg-white border border-gray-100 rounded-3xl shadow-xl flex items-center justify-center relative z-10"
        >
          <Loader2 className="text-gold animate-spin" size={28} strokeWidth={1.5} />
        </motion.div>

        {/* LOADING TEXT */}
        <div className="space-y-3 text-center">
          <h3 className="text-3xl font-bold text-black font-serif italic tracking-tight">
            Lume <span className="text-gold not-italic font-sans">Vault</span>
          </h3>
          
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <ShieldCheck size={12} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Loading Account
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="absolute bottom-10 w-full text-center opacity-30">
        <div className="flex items-center justify-center gap-2">
          <Lock size={10} className="text-black" />
          <p className="text-[9px] text-black font-bold uppercase tracking-[0.3em]">
            Client Portal
          </p>
        </div>
      </footer>

    </div>
  )
}