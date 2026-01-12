'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase' // Standard factory import
import { ArrowRight, Mail, Lock, Loader2, AlertCircle, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient() // AUDIT FIX: Initialize factory properly
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
        // Using replace to prevent the user from "backing" into the login page
        router.replace('/dashboard')
        router.refresh() // Ensures the middleware detects the new session cookie
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials.")
      setLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col relative overflow-hidden selection:bg-gold selection:text-white">
      
      {/* NAVIGATION: Clean & Minimal */}
      <nav className="w-full py-8 px-8 md:px-12">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-obsidian-900 hover:text-gold transition-all"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Shop
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          <header className="text-center mb-10 space-y-3">
            <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight leading-none">
              Welcome <span className="text-gold italic font-serif">Back</span>
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-obsidian-400">Access your account</p>
          </header>

          <form onSubmit={handleLogin} className="bg-white border border-ivory-300 p-8 md:p-12 rounded-3xl shadow-xl space-y-8">
            <div className="space-y-6">
              
              {/* EMAIL INPUT */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-gold" /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-ivory-300 rounded-xl px-5 py-4 text-obsidian-900 text-sm focus:outline-none focus:border-gold transition-all placeholder:text-obsidian-300 h-[56px]"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-obsidian-600 flex items-center gap-2">
                    <Lock size={14} className="text-gold" /> Password
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-[9px] font-bold text-gold uppercase tracking-tighter hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  exit={{ opacity: 0, y: -10 }}
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
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>

            <div className="text-center pt-6 border-t border-ivory-100">
              <p className="text-xs text-obsidian-400 font-medium">
                New to Lume Vault? {' '}
                <Link href="/auth/signup" className="text-gold font-bold hover:text-obsidian-900 transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full py-8 text-center mt-auto">
          <p className="text-[9px] text-obsidian-300 font-bold uppercase tracking-[0.3em]">
            Lume Vault &copy; 2026 | Secured Registry
          </p>
      </footer>
    </main>
  )
}