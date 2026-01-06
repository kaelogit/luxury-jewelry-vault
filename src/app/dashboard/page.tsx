'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Shield, 
  MessageSquare, Gem, Box, 
  Loader2, User, 
  LogOut, Crown
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

// SUB-COMPONENTS: Ensure these exist in src/components/dashboard/
import OverviewTab from '@/components/dashboard/OverviewTab'
import OrdersTab from '@/components/dashboard/OrdersTab'
import ProfileTab from '@/components/dashboard/ProfileTab'
import SecurityTab from '@/components/dashboard/SecurityTab'

export default function SovereignDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIdentity = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchIdentity()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <Loader2 className="animate-spin text-gold" size={48} strokeWidth={1} />
        <div className="absolute inset-0 bg-gold/5 blur-2xl animate-pulse" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.6em] italic text-obsidian-400">Authenticating Sovereign...</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 selection:bg-gold selection:text-white">
      <div className="flex min-h-screen">
        
        {/* I. SOVEREIGN SIDEBAR: The Registry Control */}
        <aside className="hidden lg:flex w-80 border-r border-ivory-300 bg-white flex-col justify-between p-12 sticky top-0 h-screen z-50 shadow-[10px_0_40px_rgba(0,0,0,0.02)]">
          <div className="space-y-16">
            
            {/* Branding Signature */}
            <div className="space-y-4">
               <div className="w-12 h-12 bg-ivory-50 border border-gold/10 rounded-2xl flex items-center justify-center shadow-sm">
                  <Crown className="text-gold" size={24} strokeWidth={1.5} />
               </div>
               <div>
                  <h2 className="text-xl font-light tracking-tighter text-obsidian-900 italic leading-none">Lume <span className="text-obsidian-400">Vault.</span></h2>
                  <p className="text-[9px] font-black text-gold uppercase tracking-[0.4em] mt-2 italic">Institutional Desk</p>
               </div>
            </div>

            {/* Navigation Protocol */}
            <nav className="space-y-2">
              <NavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18}/>} label="Registry Overview" />
              <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Box size={18}/>} label="Asset Orders" />
              <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18}/>} label="Personal Vault" />
              <NavBtn active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18}/>} label="Security Protocol" />
              
              <div className="pt-10 pb-4">
                <p className="text-[8px] font-black text-obsidian-200 uppercase tracking-widest pl-4 mb-4">Direct Lines</p>
                <button 
                  onClick={() => window.location.href = '/dashboard/concierge'}
                  className="w-full flex items-center justify-between group px-4 py-4 bg-gold/5 border border-gold/10 rounded-2xl hover:bg-gold transition-all duration-700"
                >
                  <div className="flex items-center gap-4">
                    <MessageSquare size={16} className="text-gold group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-gold group-hover:text-white transition-colors">Concierge</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse group-hover:bg-white" />
                </button>
              </div>
            </nav>
          </div>

          <button onClick={handleLogout} className="group flex items-center gap-4 text-obsidian-300 hover:text-red-500 transition-all uppercase text-[9px] font-black tracking-[0.3em] italic">
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Exit Registry
          </button>
        </aside>

        {/* II. DYNAMIC VAULT AREA */}
        <div className="flex-1 p-8 md:p-20 lg:p-24 overflow-y-auto">
          
          <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-6">
               <div className="h-[1px] w-20 bg-gold/30" />
               <h1 className="text-7xl md:text-9xl font-light text-obsidian-900 italic tracking-tighter leading-none capitalize">
                 {activeTab} <span className="text-obsidian-400">Desk.</span>
               </h1>
            </div>
            
            <div className="flex flex-col items-end gap-2 border-r-2 border-gold/20 pr-8">
               <p className="text-[11px] text-obsidian-900 font-black uppercase tracking-[0.4em] italic leading-none">
                 {profile?.full_name || 'Anonymous Sovereign'}
               </p>
               <span className="text-[9px] text-obsidian-300 font-bold uppercase tracking-widest">UID_{profile?.id?.slice(0, 8)}</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            >
              {activeTab === 'overview' && <OverviewTab profile={profile} />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'profile' && <ProfileTab profile={profile} />}
              {activeTab === 'security' && <SecurityTab />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </main>
  )
}

function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-5 w-full px-4 py-4 rounded-2xl transition-all duration-700 group ${
        active 
        ? 'bg-ivory-100 text-obsidian-900 shadow-sm border border-ivory-300' 
        : 'text-obsidian-300 hover:text-gold hover:bg-ivory-50'
      }`}
    >
      <div className={`transition-all duration-700 ${active ? 'text-gold scale-110' : 'opacity-40 group-hover:opacity-100'}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic transition-all ${active ? 'translate-x-1' : ''}`}>
        {label}
      </span>
    </button>
  )
}