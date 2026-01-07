'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Mail, Lock, Loader2, AlertCircle, ChevronLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        // Checking role for correct redirection
        const { data: profile, error: profileError } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single()
        
        if (profileError) throw new Error("Profile verification failed.")

        // Success Protocol
        router.refresh()
        router.push(profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col relative overflow-hidden">
      
      {/* NAVIGATION */}
      <nav className="w-full py-8 px-8 md:px-12">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-obsidian-900 hover:text-gold transition-all"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Store
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          
          <header className="text-center mb-10 space-y-2">
            <h1 className="text-4xl md:text-5xl font-medium text-obsidian-900 tracking-tight">
              Sign <span className="text-gold italic font-serif">In</span>
            </h1>
            <p className="label-caps !tracking-[0.2em] text-obsidian-400">Access your personal collection</p>
          </header>

          <form onSubmit={handleLogin} className="bg-white border border-ivory-300 p-8 md:p-12 rounded-[2rem] shadow-xl space-y-8">
            <div className="space-y-6">
              
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

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-obsidian-600 flex items-center gap-2">
                    <Lock size={14} className="text-gold" /> Password
                  </label>
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-[10px] font-bold text-gold uppercase hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
            </button>

            <div className="text-center pt-6 border-t border-ivory-100">
              <p className="text-xs text-obsidian-400">
                New to Lume Vault? {' '}
                <Link href="/auth/signup" className="text-gold font-bold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <footer className="w-full py-8 text-center">
         <p className="text-[10px] text-obsidian-300 font-bold uppercase tracking-widest">
           Lume Vault © 2026 | All Rights Reserved
         </p>
      </footer>
    </main>
  )
}