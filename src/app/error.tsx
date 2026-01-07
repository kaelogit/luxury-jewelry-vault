'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, RotateCcw, Fingerprint, Lock, ShieldX } from 'lucide-react'

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }
  reset: () => void 
}) {
  
  useEffect(() => {
    // Audit log for the vault administrator
    console.error('SECURE_NODE_EXCEPTION:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-ivory-100 flex flex-col items-center justify-center p-6 text-center selection:bg-gold selection:text-white relative overflow-hidden">
      
      {/* SECURITY WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <Lock size={800} className="text-obsidian-900 rotate-12" />
      </div>

      <div className="relative z-10 space-y-12 max-w-lg">
        
        {/* I. STATUS ICONOGRAPHY */}
        <div className="relative mx-auto w-24 h-24">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-gold/20 blur-3xl rounded-full"
          />
          <div className="relative w-full h-full bg-white border border-ivory-300 rounded-3xl shadow-2xl flex items-center justify-center text-gold">
            <ShieldX size={40} strokeWidth={1} />
          </div>
        </div>

        {/* II. LINGUISTIC COMMAND */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Fingerprint size={14} className="text-gold" />
            <p className="label-caps text-gold">Secure Connection Exception</p>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Protocol <br/> <span className="text-gold not-italic">Interruption.</span>
          </h2>
          
          <p className="text-sm text-obsidian-500 font-medium leading-relaxed max-w-xs mx-auto italic">
            The secure node connection was temporarily desynchronized. A manual re-initialization is required to restore vault integrity.
          </p>
        </div>

        {/* III. RECOVERY ACTION */}
        <div className="pt-8">
          <button 
            onClick={() => reset()}
            className="group relative px-16 py-6 bg-obsidian-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold transition-all duration-500 shadow-2xl flex items-center gap-4 mx-auto"
          >
            Restore Connection <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
          </button>
        </div>

        {/* IV. SYSTEM SIGNATURE */}
        <div className="pt-12 space-y-3 opacity-20">
          <p className="text-[8px] font-bold text-obsidian-400 uppercase tracking-widest">Digital Audit Signature:</p>
          <code className="text-[9px] font-mono text-gold bg-white px-4 py-2 rounded-full border border-ivory-300">
            {error.digest || 'ERR_VAULT_SYNC_001'}
          </code>
        </div>

      </div>
    </main>
  )
}