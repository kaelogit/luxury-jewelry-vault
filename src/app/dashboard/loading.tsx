'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Crown } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      
      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 px-6">
        
        {/* BRAND ICON CORE */}
        <div className="relative">
          {/* Snapier Pulse Animation (Perceived as faster) */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -inset-6 border border-gold/30 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center relative z-10"
          >
            <Crown className="text-gold" size={32} strokeWidth={1.5} />
            
            {/* Minimal Corner Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gold/40" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gold/40" />
          </motion.div>
        </div>

        {/* LOADING TEXT */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-gold"
          >
            <ShieldCheck size={14} />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Secure Connection</span>
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-bold text-black font-serif italic tracking-tight overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              Opening your <span className="text-gold not-italic">Vault</span>
            </motion.span>
          </h3>
          
          {/* Snappy Loading Dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3] 
                }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-1 h-1 bg-gold rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER SIGNATURE */}
      <footer className="absolute bottom-10 w-full text-center">
        <div className="flex items-center justify-center gap-2 opacity-20">
          <Lock size={10} className="text-black" />
          <p className="text-[8px] text-black font-bold uppercase tracking-[0.3em]">
            Lume Vault Official Registry
          </p>
        </div>
      </footer>

    </div>
  )
}