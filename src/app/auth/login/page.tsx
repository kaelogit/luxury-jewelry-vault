'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' 
import { ArrowRight, Mail, Lock, Loader2, AlertCircle, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })

      if (error) throw error

      if (data.session) {
        // PREVENT BACK-BUTTON LOOPS
        router.replace('/dashboard')
        router.refresh() 
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.")
      setLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col relative overflow-hidden selection:bg-gold selection:text-white">
      
      {/* NAVIGATION */}
      <nav className="w-full py-8 px-6 md:px-12">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-elite text-obsidian-900 hover:text-gold transition-all duration-500"
        >
          <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform duration-500" /> 
          Back to Store
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          <header className="text-center mb-12 space-y-4">
            <h1 className="text-4xl md:text-6xl font-medium text-obsidian-900 tracking-tight leading-none">
              Welcome <span className="text-gold font-serif italic">Back</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-elite text-obsidian-400">Sign in to your account</p>
          </header>

          <form onSubmit={handleLogin} className="bg-white border border-ivory-300 p-8 md:p-14 rounded-3xl shadow-xl space-y-12 relative overflow-hidden">
            {/* Subtle Texture */}
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

            <div className="space-y-8">
              
              {/* EMAIL INPUT */}
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

              {/* PASSWORD INPUT */}
              <div className="space-y-3 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[9px] font-bold uppercase tracking-boutique text-obsidian-400 group-focus-within:text-gold transition-colors flex items-center gap-2">
                    <Lock size={14} className="text-gold/60 group-focus-within:text-gold transition-colors" /> Password
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-[8px] font-bold text-obsidian-300 uppercase tracking-widest hover:text-gold transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={16} /></>}
            </button>

            <div className="text-center pt-4 border-t border-ivory-100">
              <p className="text-[10px] text-obsidian-400 font-medium tracking-wide">
                New to Lume Vault? {' '}
                <Link href="/auth/signup" className="text-gold font-bold hover:text-obsidian-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-gold pb-0.5">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-12 text-center mt-auto border-t border-ivory-200/50">
          <p className="text-[9px] text-obsidian-300 font-bold uppercase tracking-elite">
            Lume Vault &copy; 2026 | All Rights Reserved
          </p>
      </footer>
    </main>
  )
}