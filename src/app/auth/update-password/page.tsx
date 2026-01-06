'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, ArrowRight, Lock, Loader2, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/auth/login?reset=success')
    }
  }

  return (
    <main className="h-screen w-full bg-ivory-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        <header className="text-center space-y-4">
          <div className="inline-flex p-5 bg-white rounded-full border border-ivory-300 shadow-sm mb-4">
            <Lock className="text-gold" size={32} />
          </div>
          <h1 className="text-3xl font-light text-obsidian-900 tracking-tighter italic uppercase">Update Vault Key</h1>
        </header>

        <form onSubmit={handleUpdate} className="space-y-8 bg-white border border-ivory-300 p-10 rounded-[3rem] shadow-2xl">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-obsidian-400 ml-4 italic">New Vault Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-ivory-50 border border-ivory-300 rounded-[1.5rem] px-6 py-4 text-obsidian-900 focus:outline-none focus:border-gold/50 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {errorMsg && <p className="text-red-500 text-[10px] uppercase font-bold text-center">{errorMsg}</p>}

          <button 
            disabled={loading}
            className="w-full bg-obsidian-900 text-gold py-6 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-gold hover:text-white transition-all duration-500 shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Finalize Key Update'}
          </button>
        </form>
      </div>
    </main>
  )
}