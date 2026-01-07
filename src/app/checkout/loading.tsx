'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Fingerprint, ShieldCheck, Lock } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-ivory-100 flex flex-col items-center justify-center z-[100] selection:bg-gold">
      
      {/* BACKGROUND AMBIANCE */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-16">
        
        {/* I. THE BIOMETRIC CORE */}
        <div className="relative">
          {/* Subtle Outer Pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -inset-8 border border-gold/20 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-28 h-28 bg-white border border-ivory-300 rounded-3xl shadow-2xl flex items-center justify-center relative z-10"
          >
            <Fingerprint className="text-gold" size={40} strokeWidth={1} />
            
            {/* Elegant Corner Accents */}
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-gold/30" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-gold/30" />
          </motion.div>
        </div>

        {/* II. LINGUISTIC AUTHENTICATION */}
        <div className="space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-3 text-gold"
          >
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Secure Node Handshake</span>
          </motion.div>

          <h3 className="text-4xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Accessing <span className="text-gold not-italic">the Vault.</span>
            </motion.span>
          </h3>
          
          {/* Elegant Loading Sequence */}
          <div className="flex justify-center gap-2 pt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.8, 0.2] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
                className="w-1.5 h-1.5 bg-gold rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* III. INSTITUTIONAL SIGNATURE */}
      <footer className="absolute bottom-12 w-full text-center">
        <div className="flex items-center justify-center gap-2 opacity-30">
          <Lock size={12} className="text-obsidian-900" />
          <p className="text-[9px] text-obsidian-900 font-bold uppercase tracking-[0.4em]">
            Institutional Custody Registry
          </p>
        </div>
      </footer>

    </div>
  )
}