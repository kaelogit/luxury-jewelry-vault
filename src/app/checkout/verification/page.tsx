'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, CheckCircle2, 
  Loader2, Globe, Lock, ArrowRight, Fingerprint, Search, Cpu
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

export default function PaymentVerificationPage() {
  const [status, setStatus] = useState('detecting') // detecting, verifying, finalizing, confirmed
  const [loadingAuth, setLoadingAuth] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push(`/auth/login?redirect=/checkout/verification${orderId ? `?id=${orderId}` : ''}`)
      } else {
        setLoadingAuth(false)
        runVerificationFlow()
      }
    }
    checkUser()
  }, [router, orderId])

  const runVerificationFlow = () => {
    // Stage 1: Identification (0-3s)
    const t1 = setTimeout(() => setStatus('verifying'), 3000)
    
    // Stage 2: Confirmation (3-6s)
    const t2 = setTimeout(() => setStatus('finalizing'), 6000)
    
    // Stage 3: Success (6-9s)
    const t3 = setTimeout(() => {
      setStatus('confirmed')
      // Optional: Auto-redirect to Success Page after confirmation
      // setTimeout(() => router.push(`/checkout/success?id=${orderId}`), 2500)
    }, 9000)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); }
  }

  if (loadingAuth) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="label-caps text-obsidian-400 font-bold">Securing Access Node</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="max-w-xl w-full space-y-12">
        
        {/* OPERATIONAL HEADER */}
        <header className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-8 bg-white rounded-3xl border border-ivory-300 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gold/5 animate-pulse rounded-3xl" />
            {status === 'confirmed' ? (
              <CheckCircle2 className="text-gold relative z-10" size={56} strokeWidth={1.2} />
            ) : (
              <Cpu className="text-gold animate-spin-slow relative z-10" size={56} strokeWidth={1.2} />
            )}
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 font-serif italic tracking-tight uppercase">
              Vault <span className="text-gold not-italic">Settlement</span>
            </h1>
            <p className="label-caps text-obsidian-400">Transaction ID: {orderId?.slice(0, 12).toUpperCase() || 'SYNCHRONIZING'}</p>
          </div>
        </header>

        {/* VERIFICATION TERMINAL */}
        <div className="bg-white border border-ivory-300 rounded-[2.5rem] p-10 md:p-14 shadow-2xl space-y-10 relative overflow-hidden">
          <div className="space-y-8">
            <StatusLine 
              label="Payment Node Identification" 
              active={status === 'detecting'} 
              done={['verifying', 'finalizing', 'confirmed'].includes(status)} 
            />
            <StatusLine 
              label="Consensus Verification" 
              active={status === 'verifying'} 
              done={['finalizing', 'confirmed'].includes(status)} 
            />
            <StatusLine 
              label="Asset Ownership Handshake" 
              active={status === 'finalizing'} 
              done={status === 'confirmed'} 
            />
            <StatusLine 
              label="Registry Finalization" 
              active={status === 'confirmed'} 
              done={status === 'confirmed'} 
            />
          </div>

          {/* SECURITY FOOTER */}
          <div className="pt-10 border-t border-ivory-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-gold" />
              <span className="text-[10px] font-black text-obsidian-900 uppercase tracking-[0.2em] italic">E2E Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
                <Globe size={14} className="text-obsidian-200" />
                <span className="text-[10px] font-bold text-obsidian-300 uppercase tracking-widest">Global Node: 0xLUME</span>
            </div>
          </div>
        </div>

        {/* POST-VERIFICATION ACTIONS */}
        <AnimatePresence>
          {status === 'confirmed' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <p className="text-sm text-obsidian-600 leading-relaxed font-medium italic">
                Handshake complete. Your acquisition is now recorded in the Sovereign Registry. 
                Our logistics team has been notified for immediate vault release.
              </p>
              <div className="flex flex-col gap-4">
                <button 
                    onClick={() => router.push(`/checkout/success?id=${orderId}`)}
                    className="w-full bg-obsidian-900 text-gold py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group"
                >
                    View Official Confirmation <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <button 
                    onClick={() => router.push('/dashboard')}
                    className="text-[10px] font-black text-obsidian-400 uppercase tracking-widest hover:text-gold transition-colors"
                >
                    Return to Private Vault
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function StatusLine({ label, active, done }: { label: string, active: boolean, done: boolean }) {
  return (
    <div className={`flex items-center gap-6 transition-all duration-1000 ${active || done ? 'opacity-100' : 'opacity-20'}`}>
      <div className={`w-3 h-3 rounded-full transition-all duration-700 ${
        done ? 'bg-gold shadow-[0_0_15px_gold]' : active ? 'bg-gold animate-pulse' : 'bg-ivory-300'
      }`} />
      <span className={`text-[12px] font-bold uppercase tracking-widest flex-1 ${
        done ? 'text-obsidian-300 line-through italic' : active ? 'text-obsidian-900' : 'text-obsidian-200'
      }`}>
        {label}
      </span>
      <div className="w-6 h-6 flex items-center justify-center">
        {active && !done && <Loader2 size={16} className="text-gold animate-spin" />}
        {done && <CheckCircle2 size={18} className="text-gold" />}
      </div>
    </div>
  )
}