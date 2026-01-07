'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Mail, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react'
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
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* CLEAN HEADER */}
        <header className="text-center mb-10 space-y-2">
          <div className="inline-flex p-4 bg-white rounded-full border border-ivory-300 shadow-sm mb-4">
            <KeyRound className="text-gold" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight">
            Reset <span className="text-gold italic font-serif">Password</span>
          </h1>
          <p className="label-caps !tracking-[0.2em] text-obsidian-400">Account Recovery</p>
        </header>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="request"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleReset} 
              className="bg-white border border-ivory-300 p-8 md:p-12 rounded-[2rem] shadow-xl space-y-8"
            >
              <p className="text-xs text-obsidian-600 text-center leading-relaxed">
                Enter the email address associated with your account. We will send you a secure link to reset your password.
              </p>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian-600 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-gold" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[52px]"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <button 
                disabled={loading}
                className="w-full h-[64px] bg-obsidian-900 text-white rounded-lg text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Send Reset Link <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="text-center pt-4 border-t border-ivory-100">
                <Link href="/auth/login" className="text-xs text-obsidian-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:text-gold transition-colors">
                  <ArrowLeft size={14} /> Back to Sign In
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-ivory-300 p-10 md:p-14 rounded-[2rem] shadow-xl text-center space-y-6"
            >
               <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
                 <CheckCircle2 className="text-gold" size={40} />
               </div>
               <h3 className="text-2xl font-medium text-obsidian-900">Link Sent</h3>
               <p className="text-sm text-obsidian-600 leading-relaxed">
                 A password reset link has been sent to <span className="font-bold text-obsidian-900">{email}</span>. Please check your inbox to continue.
               </p>
               <Link href="/auth/login" className="inline-block pt-4 text-xs font-bold text-gold uppercase tracking-[0.2em] hover:underline">
                  Return to Sign In
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}