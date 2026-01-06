'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Fingerprint, ShieldCheck } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-ivory-100 flex flex-col items-center justify-center z-[100] selection:bg-gold">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        
        {/* I. THE BIOMETRIC CORE */}
        <div className="relative">
          {/* Animated Ring Expansion */}
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0, 0.3] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 border border-gold/30 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-ivory-300 rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10"
          >
            <Fingerprint className="text-gold" size={36} strokeWidth={1.5} />
            
            {/* Corner Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gold/40" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gold/40" />
          </motion.div>
        </div>

        {/* II. LINGUISTIC AUTHENTICATION */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-3 text-gold"
          >
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] italic">Security Handshake</span>
          </motion.div>

          <h3 className="text-3xl font-light text-obsidian-900 italic tracking-tighter overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="block"
            >
              Opening <span className="text-obsidian-400">Vault Registry...</span>
            </motion.span>
          </h3>
          
          <div className="flex justify-center gap-1.5 pt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 1, 0.3] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
                className="w-1 h-1 bg-gold rounded-full"
              />
            ))}
          </div>
        </div>

      </div>

      {/* III. SYSTEM SIGNATURE */}
      <footer className="absolute bottom-12 w-full text-center">
        <p className="text-[9px] text-obsidian-300 font-mono uppercase tracking-[0.4em] italic opacity-50">
          Lume Sovereign Protocol v4.02.1
        </p>
      </footer>

    </div>
  )
}