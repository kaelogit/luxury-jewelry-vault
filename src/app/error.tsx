'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, RotateCcw, Fingerprint, Lock } from 'lucide-react'

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  
  useEffect(() => {
    // Log the interruption to the private security console
    console.error('PROTOCOL_INTERRUPTION:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-6 text-center selection:bg-gold selection:text-white">
      
      {/* Background Security Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
        <Lock size={600} className="text-obsidian-900 rotate-12" />
      </div>

      <div className="relative z-10 space-y-12 max-w-lg">
        
        {/* I. SECURITY ICONOGRAPHY */}
        <div className="relative mx-auto w-24 h-24">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gold/10 blur-3xl rounded-full"
          />
          <div className="relative w-full h-full bg-white border border-ivory-300 rounded-[2rem] shadow-2xl flex items-center justify-center">
            <ShieldAlert className="text-gold" size={32} />
          </div>
        </div>

        {/* II. LINGUISTIC COMMAND */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Fingerprint size={14} className="text-gold" />
            <p className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic">Security Exception Detected</p>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-light text-obsidian-900 italic tracking-tighter leading-none">
            Protocol <br/> <span className="text-obsidian-400">Interruption.</span>
          </h2>
          
          <p className="text-[11px] text-obsidian-400 uppercase tracking-[0.3em] font-black max-w-xs mx-auto leading-relaxed italic">
            The secure node connection was temporarily de-synchronized. A manual handshake re-initialization is required to maintain vault integrity.
          </p>
        </div>

        {/* III. RESET ACTION */}
        <div className="pt-8">
          <button 
            onClick={() => reset()}
            className="group relative flex items-center gap-4 px-12 py-7 bg-obsidian-900 text-gold rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Re-Initialize Handshake</span>
            <RotateCcw size={16} className="relative z-10 group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>

        {/* IV. SYSTEM SIGNATURE */}
        <div className="pt-12 flex flex-col items-center gap-2 opacity-30">
          <p className="text-[8px] font-mono text-obsidian-300 uppercase">Node Error Signature:</p>
          <code className="text-[8px] font-mono text-gold bg-gold/5 px-4 py-1 rounded-full border border-gold/10">
            {error.digest || 'ERR_VAULT_SYNC_001'}
          </code>
        </div>

      </div>
    </main>
  )
}