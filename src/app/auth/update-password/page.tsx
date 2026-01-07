'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function UpdatePassword() {
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

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/auth/login?reset=success')
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        
        {/* CLEAN HEADER */}
        <header className="text-center mb-10 space-y-2">
          <div className="inline-flex p-4 bg-white rounded-full border border-ivory-300 shadow-sm mb-4">
            <Lock className="text-gold" size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight">
            New <span className="text-gold italic font-serif">Password</span>
          </h1>
          <p className="label-caps !tracking-[0.2em] text-obsidian-400">Secure your account</p>
        </header>

        <form onSubmit={handleUpdate} className="bg-white border border-ivory-300 p-8 md:p-12 rounded-[2rem] shadow-xl space-y-8">
          <p className="text-xs text-obsidian-600 text-center leading-relaxed">
            Please enter and confirm your new password below to regain access to your collection.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian-600 ml-1 flex items-center gap-2">
                <Lock size={14} className="text-gold" /> New Password
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[52px]"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian-600 ml-1 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-gold" /> Confirm Password
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white border border-ivory-300 rounded-lg px-4 py-3 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[52px]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-xs text-red-600 font-medium"
              >
                <AlertCircle size={18} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            disabled={loading}
            className="w-full h-[64px] bg-obsidian-900 text-white rounded-lg text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-gold transition-all duration-300 shadow-lg disabled:opacity-50"
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