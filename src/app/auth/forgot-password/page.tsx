'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' // Standard factory import
import { ArrowRight, Mail, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ForgotPassword() {
  const supabase = createClient() // AUDIT FIX: Initialized the factory properly
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
        // Note: Ensure this URL is also added to your Supabase Auth Redirect Allow List
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
      setErrorMsg("An unexpected connection error occurred.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="w-full max-w-md">
        
        {/* HEADER: Clean & Professional */}
        <header className="text-center mb-10 space-y-3">
          <div className="inline-flex p-4 bg-white rounded-2xl border border-ivory-300 shadow-sm mb-2">
            <KeyRound className="text-gold" size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight leading-none">
            Reset <span className="text-gold italic font-serif">Password</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-400">Account Recovery</p>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="request"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleReset} 
              className="bg-white border border-ivory-300 p-8 md:p-12 rounded-3xl shadow-xl space-y-8"
            >
              <p className="text-xs text-obsidian-500 text-center leading-relaxed font-medium">
                Enter your email address and we will send you a secure link to reset your account credentials.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-gold" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-ivory-300 rounded-xl px-5 py-4 text-obsidian-900 text-sm outline-none focus:border-gold transition-all placeholder:text-ivory-300 h-[56px]"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold text-center uppercase tracking-tighter">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full h-[64px] bg-obsidian-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-obsidian-900 transition-all duration-500 shadow-lg disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Send Reset Link <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-ivory-100">
                <Link href="/auth/login" className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-ivory-300 p-10 md:p-14 rounded-3xl shadow-xl text-center space-y-6"
            >
               <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle2 className="text-gold" size={40} strokeWidth={1.5} />
               </div>
               <h3 className="text-2xl font-medium text-obsidian-900">Email Dispatched</h3>
               <p className="text-sm text-obsidian-500 leading-relaxed font-medium">
                 A password reset link has been sent to <br/>
                 <span className="font-bold text-obsidian-900">{email}</span>. <br/>
                 Please check your inbox to continue.
               </p>
               <Link href="/auth/login" className="inline-block pt-6 text-[10px] font-bold text-gold uppercase tracking-[0.3em] hover:text-obsidian-900 transition-colors">
                  Return to Sign In
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}