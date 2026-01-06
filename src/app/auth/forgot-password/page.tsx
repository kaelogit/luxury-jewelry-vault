'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, ArrowRight, Mail, Loader2, ArrowLeft, KeyRound } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    // SOVEREIGN RECOVERY INITIATION
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      setSubmitted(true)
      setLoading(false)
    }
  }

  return (
    <main className="h-screen w-full bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="w-full max-w-md space-y-12">
        
        {/* BRANDING HEADER */}
        <header className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex p-5 bg-white rounded-full border border-ivory-300 shadow-sm mb-4"
          >
            <KeyRound className="text-gold" size={32} />
          </motion.div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-light text-obsidian-900 tracking-tighter italic uppercase leading-none">
              Credential <span className="text-gold font-bold">Recovery.</span>
            </h1>
            <p className="text-[10px] text-obsidian-400 font-black uppercase tracking-[0.4em] italic">
              Initiate Secure Handshake
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="request"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleReset} 
              className="space-y-8 bg-white border border-ivory-300 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gold/20" />
              
              <p className="text-[11px] text-obsidian-400 text-center leading-relaxed uppercase font-bold tracking-widest italic">
                Enter the identifier associated with your vault account. A secure recovery link will be dispatched.
              </p>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-obsidian-400 ml-4 italic flex items-center gap-2">
                  <Mail size={12} className="text-gold" /> Registry Email
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-[1.5rem] px-6 py-4 text-obsidian-900 focus:outline-none focus:border-gold/50 transition-all font-medium placeholder:text-obsidian-200"
                  placeholder="ADDRESS@EMAIL.COM"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[10px] text-red-600 font-bold uppercase tracking-widest text-center">
                  {errorMsg}
                </div>
              )}

              <button 
                disabled={loading}
                className="group w-full bg-obsidian-900 text-gold py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    Transmit Recovery Link <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-ivory-200">
                <Link href="/auth/login" className="text-[10px] text-obsidian-300 uppercase tracking-widest font-black flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <ArrowLeft size={12} /> Return to Portal
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 bg-white border border-ivory-300 p-12 rounded-[4rem] shadow-2xl text-center relative"
            >
               <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="text-gold" size={40} />
               </div>
               <h3 className="text-xl font-light text-obsidian-900 italic uppercase">Link Dispatched</h3>
               <p className="text-[11px] text-obsidian-400 font-bold uppercase tracking-widest leading-relaxed italic">
                 A cryptographic recovery link has been sent to your secure inbox. Please inspect your messages to complete the protocol.
               </p>
               <Link href="/auth/login" className="inline-block pt-6 text-[10px] font-black text-gold uppercase tracking-[0.3em] border-b border-gold/20 pb-1">
                  Back to Security Gate
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}