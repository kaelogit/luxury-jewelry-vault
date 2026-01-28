'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' 
import { ArrowRight, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function UpdatePassword() {
  const supabase = createClient()
  const router = useRouter()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
        router.refresh()
        router.push('/auth/login?reset=success')
      }
    } catch (err) {
      setErrorMsg("An unexpected connection error occurred.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6 selection:bg-gold selection:text-white">
      <div className="w-full max-w-md">
        
        {/* HEADER */}
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex p-4 bg-white rounded-2xl border border-ivory-300 shadow-sm mb-2">
            <Lock className="text-gold" size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight leading-none">
            Reset <span className="text-gold font-serif italic">Password</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-elite text-obsidian-400">Secure your account</p>
        </header>

        <form 
          onSubmit={handleUpdate} 
          className="bg-white border border-ivory-300 p-8 md:p-14 rounded-3xl shadow-xl space-y-12 relative overflow-hidden"
        >
          {/* Subtle Texture */}
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <p className="text-xs text-obsidian-500 text-center leading-relaxed font-medium">
            Enter your new password below to regain access to your account.
          </p>

          <div className="space-y-8">
            {/* NEW PASSWORD */}
            <div className="space-y-3 group">
              <label className="text-[9px] font-bold uppercase tracking-boutique text-obsidian-400 group-focus-within:text-gold transition-colors ml-1 flex items-center gap-2">
                <Lock size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> New Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-obsidian-200 h-[56px] font-medium"
                placeholder="••••••••"
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="space-y-3 group">
              <label className="text-[9px] font-bold uppercase tracking-boutique text-obsidian-400 group-focus-within:text-gold transition-colors ml-1 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> Confirm Password
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-ivory-50 border-b border-ivory-300 rounded-none px-4 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold focus:bg-white transition-all placeholder:text-obsidian-200 h-[56px] font-medium"
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
                className="p-5 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-xs text-red-600 font-bold uppercase tracking-boutique"
              >
                <AlertCircle size={16} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[64px] bg-obsidian-900 text-white rounded-xl text-[11px] font-bold uppercase tracking-elite flex items-center justify-center gap-4 hover:bg-gold hover:text-obsidian-900 transition-all duration-500 shadow-xl disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                Update Password <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}