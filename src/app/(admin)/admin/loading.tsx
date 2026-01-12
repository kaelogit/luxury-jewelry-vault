'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      
      {/* BACKGROUND AMBIANCE - Reduced complexity for faster rendering */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        
        {/* I. BOUTIQUE LOGO CORE */}
        <div className="relative">
          {/* Snappy Outer Pulse */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute -inset-6 border border-gold/30 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-gray-100 rounded-[2rem] shadow-xl flex items-center justify-center relative z-10"
          >
            <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1} />
            
            {/* Elegant Corner Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gold/40" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gold/40" />
          </motion.div>
        </div>

        {/* II. PROFESSIONAL STATUS */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-3 text-gold"
          >
            <ShieldCheck size={14} />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Secure Admin Session</span>
          </motion.div>

          <h3 className="text-3xl font-bold text-black tracking-tight overflow-hidden uppercase">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="block"
            >
              Opening <span className="text-gold italic font-serif lowercase">the</span> Boutique
            </motion.span>
          </h3>
          
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            Synchronizing encrypted data
          </p>
        </div>
      </div>

      {/* III. BRAND SIGNATURE */}
      <footer className="absolute bottom-12 w-full text-center">
        <div className="flex items-center justify-center gap-2 opacity-40">
          <Lock size={12} className="text-black" />
          <p className="text-[9px] text-black font-bold uppercase tracking-[0.3em]">
            Lume Vault Administrative Console
          </p>
        </div>
      </footer>

    </div>
  )
}