'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Activity, Cpu, CheckCircle2, 
  Loader2, Globe, Lock, ArrowRight, Fingerprint 
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SettlementProtocol() {
  const [status, setStatus] = useState('detecting') // detecting, processing, confirmed
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()

  // 1. SECURITY HANDSHAKE: Ensure user is signed in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Kick out unauthorized access
        router.push('/auth/login?redirect=/checkout/verification')
      } else {
        setIsAuthenticated(true)
        setLoadingAuth(false)
        initiateSettlement()
      }
    }
    checkUser()
  }, [])

  // 2. SETTLEMENT SEQUENCE
  const initiateSettlement = () => {
    const timer = setTimeout(() => setStatus('processing'), 3000)
    const timer2 = setTimeout(() => setStatus('confirmed'), 8000)
    return () => { clearTimeout(timer); clearTimeout(timer2); }
  }

  if (loadingAuth) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <Loader2 className="text-gold animate-spin" size={40} />
      <p className="text-[10px] text-obsidian-400 uppercase tracking-[0.5em] font-black italic">Verifying Clearance...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="max-w-xl w-full space-y-12">
        
        {/* OPULENT HEADER */}
        <header className="text-center space-y-8">
          <div className="relative inline-flex">
            <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full animate-pulse" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative p-8 bg-white rounded-full border border-gold/30 shadow-2xl"
            >
              {status === 'confirmed' ? (
                <CheckCircle2 className="text-gold" size={48} />
              ) : (
                <Fingerprint className="text-gold animate-pulse" size={48} />
              )}
            </motion.div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-light text-obsidian-900 tracking-tighter italic uppercase leading-none">
              Settlement <span className="text-gold font-bold">Protocol.</span>
            </h1>
            <p className="text-[10px] text-obsidian-400 font-black uppercase tracking-[0.5em] italic">
              Order Ref: LV-8821-X90
            </p>
          </div>
        </header>

        {/* SETTLEMENT TERMINAL */}
        <div className="bg-white border border-ivory-300 rounded-[4rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold/20" />
          
          <div className="space-y-8">
            <StatusLine 
              label="Mempool Detection" 
              active={status === 'detecting' || status === 'processing' || status === 'confirmed'} 
              done={status === 'processing' || status === 'confirmed'}
            />
            <StatusLine 
              label="Blockchain Verification" 
              active={status === 'processing'} 
              done={status === 'confirmed'}
            />
            <StatusLine 
              label="Physical Asset Reservation" 
              active={status === 'confirmed'} 
              done={status === 'confirmed'}
            />
            <StatusLine 
              label="Vault Custody Transfer" 
              active={status === 'confirmed'} 
              done={status === 'confirmed'}
            />
          </div>

          <div className="pt-10 border-t border-ivory-200">
            <div className="flex justify-between items-center bg-ivory-50 p-6 rounded-3xl border border-ivory-300 shadow-inner">
              <div className="flex items-center gap-4">
                <Cpu size={16} className="text-gold" />
                <span className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest italic">Node Status</span>
              </div>
              <span className="text-[10px] text-gold font-black uppercase tracking-widest animate-pulse">Synchronized</span>
            </div>
          </div>
        </div>

        {/* SUCCESS INTERFACE */}
        <AnimatePresence>
          {status === 'confirmed' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <p className="text-xs text-obsidian-600 font-medium leading-relaxed max-w-sm mx-auto uppercase tracking-tighter italic">
                Signature confirmed. Your assets are now physically secured and held under your unique cryptographic profile.
              </p>
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full bg-obsidian-900 text-gold py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl group flex items-center justify-center gap-4"
              >
                Access Private Vault <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function StatusLine({ label, active, done }: { label: string, active: boolean, done: boolean }) {
  return (
    <div className={`flex items-center gap-6 transition-all duration-1000 ${active ? 'opacity-100' : 'opacity-10'}`}>
      <div className={`w-3 h-3 rounded-full ${done ? 'bg-gold shadow-[0_0_12px_gold]' : active ? 'bg-gold animate-pulse' : 'bg-ivory-300'}`} />
      <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${done ? 'text-obsidian-300 line-through decoration-gold/30' : active ? 'text-obsidian-900 italic' : 'text-obsidian-200'}`}>
        {label}
      </span>
      {active && !done && <Loader2 size={16} className="text-gold animate-spin ml-auto" />}
      {done && <CheckCircle2 size={16} className="text-gold ml-auto" />}
    </div>
  )
}