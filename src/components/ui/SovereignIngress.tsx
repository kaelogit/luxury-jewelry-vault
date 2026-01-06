'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Lock, Globe, Fingerprint, Shield } from 'lucide-react'
import { useIngressStore } from '@/store/useIngressStore'

const BOOT_LOGS = [
  "Calibrating Institutional Ingress...",
  "Synchronizing Swiss Custodial Nodes...",
  "Authenticating Biometric Registry...",
  "Decrypting Sovereign Metadata...",
  "Vault Ready. Welcome back."
]

export default function SovereignIngress() {
  const { isBooted, setBooted } = useIngressStore()
  const [logIndex, setLogIndex] = useState(0)

  useEffect(() => {
    if (logIndex < BOOT_LOGS.length - 1) {
      const timer = setTimeout(() => setLogIndex(logIndex + 1), 600)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setBooted(true), 1200)
      return () => clearTimeout(timer)
    }
  }, [logIndex, setBooted])

  return (
    <AnimatePresence>
      {!isBooted && (
        <motion.div 
          exit={{ 
            opacity: 0, 
            y: -100, 
            filter: "blur(60px)",
            transition: { duration: 1.5, ease: [0.19, 1, 0.22, 1] }
          }}
          className="fixed inset-0 z-[999] bg-ivory-100 flex flex-col items-center justify-center p-6 selection:bg-gold"
        >
          {/* I. ATMOSPHERIC SCRIM: Subtle Gold Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)]" />

          <div className="w-full max-w-sm space-y-16 relative z-10">
            
            {/* II. THE CENTRAL SEAL: Biometric Handshake */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center"
            >
              <div className="relative group">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-gold/10 blur-[80px] rounded-full animate-pulse" />
                
                {/* The Seal Container */}
                <div className="relative p-10 bg-white border border-ivory-300 rounded-[2.5rem] shadow-sm group-hover:border-gold/30 transition-all duration-1000">
                  <Fingerprint size={48} strokeWidth={1} className="text-gold" />
                </div>
              </div>
            </motion.div>

            {/* III. INSTITUTIONAL LOGS: The Protocol Registry */}
            <div className="space-y-8">
              <div className="h-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={logIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.5em] italic text-center leading-none"
                  >
                    {BOOT_LOGS[logIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Progress Bar: Gold Filament */}
              <div className="h-[1px] w-48 mx-auto bg-ivory-300 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3.2, ease: "easeInOut" }}
                  className="h-full bg-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                />
              </div>
            </div>

            {/* IV. READINESS MATRIX: Minimalist Trust Indicators */}
            <div className="flex justify-center gap-10 opacity-30">
              <SystemStatus icon={<Shield size={12}/>} label="INSTITUTIONAL" />
              <div className="w-[1px] h-6 bg-ivory-300 rotate-[20deg]" />
              <SystemStatus icon={<Globe size={12}/>} label="SWISS_NODE" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SystemStatus({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-gold">{icon}</div>
      <span className="text-[8px] font-black uppercase tracking-[0.3em] text-obsidian-300">{label}</span>
    </div>
  )
}