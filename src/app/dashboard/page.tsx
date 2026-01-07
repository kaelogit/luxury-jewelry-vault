'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Shield, 
  MessageSquare, User, 
  LogOut, Crown, ShoppingBag,
  Loader2, ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// SUB-COMPONENTS
import OverviewTab from '@/components/dashboard/OverviewTab'
import OrdersTab from '@/components/dashboard/OrdersTab'
import ProfileTab from '@/components/dashboard/ProfileTab'

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchIdentity = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(data)
      } else {
        router.push('/auth/login')
      }
      setLoading(false)
    }
    fetchIdentity()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="h-screen bg-ivory-100 flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-gold" size={32} strokeWidth={1.5} />
      <p className="label-caps text-obsidian-400">Accessing Account</p>
    </div>
  )

  return (
    <main className="min-h-screen bg-ivory-100 selection:bg-gold selection:text-white">
      <div className="flex min-h-screen relative">
        
        {/* I. SIDEBAR: THE PRIVATE NAVIGATOR */}
        <aside className="hidden lg:flex w-72 border-r border-ivory-300 bg-white flex-col justify-between p-10 sticky top-0 h-screen z-50">
          <div className="space-y-12">
            
            {/* Branding */}
            <div className="space-y-4">
               <div className="w-10 h-10 bg-ivory-50 border border-gold/10 rounded-lg flex items-center justify-center">
                  <Crown className="text-gold" size={20} strokeWidth={1.5} />
               </div>
               <div>
                  <h2 className="text-lg font-medium tracking-tight text-obsidian-900 font-serif italic leading-none">Lume <span className="text-gold not-italic">Vault.</span></h2>
                  <p className="text-[9px] font-bold text-obsidian-400 uppercase tracking-widest mt-2">Client Portal</p>
               </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <NavBtn active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={18}/>} label="Overview" />
              <NavBtn active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={18}/>} label="Order History" />
              <NavBtn active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={18}/>} label="Account Details" />
              
              <div className="pt-8">
                <button 
                  onClick={() => router.push('/concierge')}
                  className="w-full flex items-center justify-between px-4 py-4 bg-gold/5 border border-gold/10 rounded-xl group hover:bg-gold transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-gold group-hover:text-white" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gold group-hover:text-white">Concierge</span>
                  </div>
                  <ChevronRight size={14} className="text-gold group-hover:text-white" />
                </button>
              </div>
            </nav>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3 text-obsidian-400 hover:text-red-500 transition-colors uppercase text-[9px] font-bold tracking-widest">
            <LogOut size={16} /> Sign Out
          </button>
        </aside>

        {/* II. DASHBOARD CONTENT */}
        <div className="flex-1 p-8 md:p-16 lg:p-24 overflow-y-auto">
          
          <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-ivory-300 pb-12">
            <div className="space-y-2">
               <p className="label-caps text-gold">Welcome Back</p>
               <h1 className="text-4xl md:text-6xl font-medium text-obsidian-900 font-serif italic tracking-tight capitalize leading-none">
                 {profile?.full_name?.split(' ')[0] || 'Client'} <span className="text-obsidian-400 not-italic">—</span> Dashboard
               </h1>
            </div>
            
            <div className="bg-white px-6 py-4 rounded-xl border border-ivory-300 shadow-sm flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <p className="text-[10px] text-obsidian-600 font-bold uppercase tracking-widest leading-none">
                 Account Active
              </p>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {activeTab === 'overview' && <OverviewTab profile={profile} />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'profile' && <ProfileTab profile={profile} />}
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
      className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-all group ${
        active 
        ? 'bg-obsidian-900 text-white shadow-md' 
        : 'text-obsidian-400 hover:text-gold hover:bg-ivory-50'
      }`}
    >
      <div className={`${active ? 'text-gold' : 'text-obsidian-300 group-hover:text-gold'}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-widest">
        {label}
      </span>
    </button>
  )
}