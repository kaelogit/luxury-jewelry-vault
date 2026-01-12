'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, CreditCard, Loader2 } from 'lucide-react'

export default function CheckoutLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
      
      {/* BACKGROUND AMBIANCE - Optimized for trust and speed */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12">
        
        {/* I. TRANSACTION CORE */}
        <div className="relative">
          {/* Gentle breathing pulse for security assurance */}
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -inset-10 border border-gold/40 rounded-full"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10"
          >
            <div className="relative">
                <CreditCard className="text-black" size={32} strokeWidth={1} />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-4 -right-4 text-gold"
                >
                    <Loader2 size={20} />
                </motion.div>
            </div>
            
            {/* Elegant Security Accents */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-gold/40" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-gold/40" />
          </motion.div>
        </div>

        {/* II. TRANSACTION STATUS */}
        <div className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-3 text-gold"
          >
            <ShieldCheck size={14} />
            <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Encrypted Channel Active</span>
          </motion.div>

          <h3 className="text-3xl font-bold text-black tracking-tight overflow-hidden uppercase">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              Securing <span className="text-gold italic font-serif lowercase">your</span> Purchase
            </motion.span>
          </h3>
          
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest px-8 max-w-xs mx-auto leading-relaxed">
            Please do not refresh. Establishing connection to the payment gateway.
          </p>
        </div>
      </div>

      {/* III. COMPLIANCE SIGNATURE */}
      <footer className="absolute bottom-12 w-full text-center">
        <div className="flex flex-col items-center justify-center gap-4 opacity-50">
          <div className="flex items-center gap-2">
            <Lock size={10} className="text-black" />
            <p className="text-[8px] text-black font-bold uppercase tracking-[0.3em]">
              PCI-DSS Level 1 Certified Security
            </p>
          </div>
          {/* Subtle separator */}
          <div className="w-12 h-[1px] bg-gold/30" />
        </div>
      </footer>

    </div>
  )
}