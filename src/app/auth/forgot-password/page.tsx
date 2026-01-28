'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' 
import { ArrowRight, Mail, Loader2, ArrowLeft, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForgotPassword() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
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
    } catch (err) {
      setErrorMsg("Unable to send reset link. Please check your connection.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="w-full max-w-md">
        
        {/* HEADER */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex p-4 bg-white rounded-2xl border border-ivory-300 shadow-sm mb-2">
            <KeyRound className="text-gold" size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight leading-none">
            Reset <span className="text-gold italic font-serif">Password</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-elite text-obsidian-400">Account Recovery</p>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="request"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleReset} 
              className="bg-white border border-ivory-300 p-8 md:p-14 rounded-3xl shadow-xl space-y-10 relative overflow-hidden"
            >
              {/* Subtle Texture */}
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

              <p className="text-xs text-obsidian-500 text-center leading-relaxed font-medium">
                Enter the email address associated with your account. We will send you a secure link to reset your password.
              </p>

              <div className="space-y-3 group">
                <label className="text-[9px] font-bold uppercase tracking-boutique text-obsidian-400 group-focus-within:text-gold transition-colors ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-obsidian-200 h-[56px] font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-xs text-red-600 font-bold uppercase tracking-boutique">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-[64px] bg-obsidian-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-elite flex items-center justify-center gap-4 hover:bg-gold hover:text-obsidian-900 transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                  <>
                    Send Reset Link <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-ivory-100">
                <Link href="/auth/login" className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <ArrowLeft size={12} /> Back to Sign In
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-ivory-300 p-10 md:p-14 rounded-3xl shadow-xl text-center space-y-8 relative overflow-hidden"
            >
               {/* Subtle Texture */}
               <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

               <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto border border-gold/20">
                 <CheckCircle2 className="text-gold" size={40} strokeWidth={1.5} />
               </div>
               
               <div className="space-y-2">
                 <h3 className="text-2xl font-medium text-obsidian-900">Check Your Email</h3>
                 <p className="text-sm text-obsidian-500 leading-relaxed font-medium">
                   We have sent a password reset link to <br/>
                   <span className="font-bold text-obsidian-900">{email}</span>.
                 </p>
               </div>

               <Link href="/auth/login" className="inline-block pt-2 text-[10px] font-bold text-gold uppercase tracking-elite hover:text-obsidian-900 transition-colors border-b border-transparent hover:border-obsidian-900 pb-0.5">
                  Return to Sign In
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}