'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' // FIX: Factory import
import { ArrowRight, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function UpdatePassword() {
  const supabase = createClient() // AUDIT FIX: Initialize factory
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setErrorMsg(error.message)
        setLoading(false)
      } else {
        // Refresh to ensure session cookies are updated before redirect
        router.refresh()
        router.push('/auth/login?reset=success')
      }
    } catch (err) {
      setErrorMsg("An unexpected security error occurred.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="w-full max-w-md">
        
        {/* HEADER: Professional & Secure */}
        <header className="text-center mb-10 space-y-3">
          <div className="inline-flex p-4 bg-white rounded-2xl border border-ivory-300 shadow-sm mb-2">
            <Lock className="text-gold" size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight leading-none">
            New <span className="text-gold italic font-serif">Password</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-400">Account Security</p>
        </header>

        <form 
          onSubmit={handleUpdate} 
          className="bg-white border border-ivory-300 p-8 md:p-12 rounded-3xl shadow-xl space-y-8"
        >
          <p className="text-xs text-obsidian-500 text-center leading-relaxed font-medium">
            Please enter and confirm your new password below to update your account credentials.
          </p>

          <div className="space-y-6">
            {/* NEW PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2">
                <Lock size={14} className="text-gold" /> New Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-ivory-300 rounded-xl px-5 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[56px]"
                placeholder="••••••••"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-gold" /> Confirm Password
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-ivory-300 rounded-xl px-5 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[56px]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-xs text-red-600 font-bold uppercase tracking-tighter"
              >
                <AlertCircle size={16} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[64px] bg-obsidian-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-obsidian-900 transition-all duration-500 shadow-lg disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Update Password <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}