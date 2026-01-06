'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ArrowRight, ShieldCheck, Mail, Key, Loader2, AlertCircle, ChevronLeft, Globe, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
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
        const { data: profile, error: profileError } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single()
        
        if (profileError) throw new Error("Registry profile not found.")

        router.refresh()
        setTimeout(() => {
          router.push(profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
        }, 100)
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Connection to Sovereign Node failed.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-ivory-100 flex flex-col selection:bg-gold selection:text-white relative overflow-hidden">
      
      {/* I. MINIMALIST SOVEREIGN NAV */}
      <nav className="w-full py-8 px-8 md:px-12 flex justify-between items-center relative z-50">
        <Link 
          href="/" 
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-900 hover:text-gold transition-all"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Entry
        </Link>
        
        <div className="flex items-center gap-4 opacity-40">
           <div className="h-[1px] w-12 bg-obsidian-900" />
           <span className="text-[9px] font-black uppercase tracking-widest italic">Node 4.0.2</span>
        </div>
      </nav>

      {/* II. CENTRAL ACCESS INTERFACE */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md space-y-12">
          
          <header className="text-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex p-5 bg-white rounded-[2rem] border border-ivory-300 shadow-sm mb-4"
            >
              <ShieldCheck className="text-gold" size={32} strokeWidth={1.5} />
            </motion.div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-light text-obsidian-900 tracking-tighter italic uppercase leading-none">
                Lume <span className="text-gold">Vault.</span>
              </h1>
              <p className="text-[10px] text-obsidian-400 font-black uppercase tracking-[0.6em] italic">
                Sovereign Access Protocol
              </p>
            </div>
          </header>

          <form onSubmit={handleLogin} className="space-y-8 bg-white border border-ivory-300 p-10 md:p-14 rounded-[4rem] shadow-2xl relative">
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-400 ml-6 italic flex items-center gap-3">
                  <Mail size={12} className="text-gold" /> Identity Signature
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-[2rem] px-8 py-5 text-obsidian-900 focus:outline-none focus:border-gold transition-all font-medium placeholder:text-ivory-300 shadow-inner"
                  placeholder="ADDRESS@REGISTRY.COM"
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-400 italic flex items-center gap-3">
                    <Key size={12} className="text-gold" /> Password
                  </label>
                  {/* CORRECTED LINK COMPONENT: Size removed */}
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-[9px] font-bold text-gold uppercase hover:text-obsidian-900 transition-colors"
                  >
                    Recovery?
                  </Link>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-ivory-50 border border-ivory-300 rounded-[2rem] px-8 py-5 text-obsidian-900 focus:outline-none focus:border-gold transition-all font-medium placeholder:text-ivory-300 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-4 text-[10px] text-red-600 font-bold uppercase tracking-widest"
                >
                  <AlertCircle size={16} /> {errorMsg}
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={loading}
              className="w-full h-[88px] bg-obsidian-900 text-gold rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-gold hover:text-white transition-all duration-700 shadow-2xl active:scale-95 group overflow-hidden"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <>Authorize Access <ArrowRight size={20} /></>}
            </button>

            <div className="text-center pt-8 border-t border-ivory-100">
              <p className="text-[10px] text-obsidian-300 uppercase tracking-[0.3em] font-black italic">
                New to the Vault? {' '}
                <Link href="/auth/signup" className="text-gold hover:text-obsidian-900 transition-colors underline underline-offset-8 decoration-gold/30">
                  Register Membership
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* III. SOFT SOVEREIGN FOOTER */}
      <footer className="w-full py-10 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 relative z-50">
         <div className="flex items-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
               <Globe size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest text-obsidian-900">Zurich Node</span>
            </div>
            <div className="flex items-center gap-2">
               <Lock size={12} />
               <span className="text-[8px] font-black uppercase tracking-widest text-obsidian-900">AES-256</span>
            </div>
         </div>
         
         <p className="text-[9px] text-obsidian-200 font-black uppercase tracking-[0.6em] italic">
           Lume Vault Institutional Registry © 2026
         </p>

         <div className="flex gap-8 opacity-40">
            <Link href="/legal/privacy" className="text-[8px] font-black uppercase tracking-widest hover:text-gold transition-colors">Privacy</Link>
            <Link href="/legal/terms" className="text-[8px] font-black uppercase tracking-widest hover:text-gold transition-colors">Terms</Link>
         </div>
      </footer>
    </main>
  )
}