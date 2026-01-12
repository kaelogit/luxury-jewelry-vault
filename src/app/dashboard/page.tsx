'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, Shield, 
  MessageSquare, User, 
  LogOut, Crown, ShoppingBag,
  Loader2, ChevronRight, Menu, X,
  Settings, Store, ArrowRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Toaster } from 'sonner' // AUDIT: Added for Boutique Alerts
import LiveNotifications from '@/components/ui/LiveNotifications' // AUDIT: Added global listener

// SUB-COMPONENTS
import OverviewTab from '@/components/dashboard/OverviewTab'
import OrdersTab from '@/components/dashboard/OrdersTab'
import ProfileTab from '@/components/dashboard/ProfileTab'

export default function ClientDashboard() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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
  }, [router, supabase])

  // REFINED LOGOUT: Ensures a clean session break and stops all listeners
  const handleLogout = async () => {
    try {
      // 1. Tell Supabase to end the session
      await supabase.auth.signOut()
      
      // 2. Clear physical storage to prevent "Multiple Instance" errors
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }

      // 3. Hard redirect to home (Forces a browser refresh which is safer for security)
      window.location.href = '/'
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback if the hard redirect fails
      router.push('/')
    }
  }

  // SNAPPY TAB SWITCHER: Closes mobile menu automatically
  const switchTab = (tab: string) => {
    setActiveTab(tab)
    if (isMenuOpen) setIsMenuOpen(false)
  }

  // REFINED LOADING: Premium aesthetic with standard English
  if (loading) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -inset-4 border border-gold/20 rounded-full"
        />
        <Loader2 className="animate-spin text-gold relative z-10" size={32} strokeWidth={1} />
      </div>
      <div className="text-center space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Lume Vault</p>
        <p className="text-[8px] text-gray-400 uppercase tracking-widest">Opening your private registry</p>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col lg:flex-row relative overflow-x-hidden">
      
      {/* I. LIVE NOTIFICATION ENGINE */}
      <Toaster position="bottom-right" expand={false} richColors closeButton />
      {profile?.id && <LiveNotifications userId={profile.id} type="client" />}

      {/* 1. DESKTOP SIDEBAR NAVIGATION */}
<aside className="hidden lg:flex w-80 border-r border-gray-200 bg-white flex-col justify-between p-10 sticky top-0 h-screen z-50">
  <div className="space-y-12">
    {/* Brand Identity - Standard Typographic Logo */}
    <Link href="/" className="group block space-y-1">
      <h2 className="text-2xl font-bold tracking-tighter text-black leading-none">
        LUME <span className="text-gold italic font-serif">VAULT</span>
      </h2>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
        Account Dashboard
      </p>
    </Link>

    {/* Core Navigation */}
    <nav className="space-y-2">
      <NavBtn 
        active={activeTab === 'overview'} 
        onClick={() => setActiveTab('overview')} 
        icon={<LayoutDashboard size={18} />} 
        label="Dashboard" 
      />
      <NavBtn 
        active={activeTab === 'orders'} 
        onClick={() => setActiveTab('orders')} 
        icon={<ShoppingBag size={18} />} 
        label="My Orders" 
      />
      <NavBtn 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')} 
        icon={<Settings size={18} />} 
        label="Account Settings" 
      />
      
      <div className="pt-10 space-y-4">
        {/* Primary Action */}
        <Link 
          href="/collection" 
          className="w-full flex items-center justify-between px-6 py-5 bg-black text-white rounded-xl group hover:bg-gold transition-all duration-300 shadow-md"
        >
          <div className="flex items-center gap-4">
            <Store size={16} className="text-gold" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Shop All</span>
          </div>
          <ChevronRight size={14} />
        </Link>

        {/* Secondary Action */}
        <button 
          onClick={() => router.push('/dashboard/concierge')}
          className="w-full flex items-center justify-between px-6 py-5 bg-gray-50 border border-gray-200 rounded-xl group hover:bg-white hover:border-gold transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <MessageSquare size={16} className="text-gold" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-600 group-hover:text-black">Customer Support</span>
          </div>
          <ChevronRight size={14} className="text-gray-400 group-hover:text-gold" />
        </button>
      </div>
    </nav>
  </div>

  <button 
    onClick={handleLogout} 
    className="flex items-center gap-3 text-gray-400 hover:text-red-600 transition-colors uppercase text-[10px] font-bold tracking-widest p-4"
  >
    <LogOut size={16} /> 
    Log Out
  </button>
</aside>

{/* 2. MOBILE INTERFACE */}
<div className="lg:hidden sticky top-0 z-[80] bg-white border-b border-gray-200 p-6 flex justify-between items-center shadow-sm">
  <Link href="/" className="flex flex-col active:scale-95 transition-transform">
    <h2 className="text-xl font-bold tracking-tighter text-black leading-none">
      LUME <span className="text-gold italic font-serif">VAULT</span>
    </h2>
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
      My Account
    </p>
  </Link>
  
  <button 
    onClick={() => setIsMenuOpen(!isMenuOpen)} 
    className="p-3 bg-black text-white rounded-xl active:scale-90 transition-all"
  >
    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
  </button>
</div>

      {/* Mobile Drawer Menu (---) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed inset-y-0 right-0 w-[80%] z-[75] bg-white pt-24 px-6 flex flex-col shadow-2xl"
            >
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mb-4 pl-4">Registry Navigation</p>
                
                <MenuLink icon={<Store size={20} />} label="Shop Collection" onClick={() => router.push('/collection')} highlight />
                <MenuLink icon={<MessageSquare size={20} />} label="Boutique Support" onClick={() => router.push('/dashboard/concierge')} />
                <MenuLink icon={<Settings size={20} />} label="Personal Settings" onClick={() => switchTab('profile')} />

                <div className="h-[1px] bg-gray-100 my-8" />

                <button 
                  type="button" // Critical to prevent accidental form triggers
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between p-6 bg-red-50/50 border border-red-100 text-red-500 rounded-[2rem] active:scale-95 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Secure Sign Out</span>
                  </div>
                  <ChevronRight size={16} className="opacity-30" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Tab Bar (Quick Access) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center z-[60] shadow-[0_-5px_30px_rgba(0,0,0,0.05)] pb-safe">
         <MobileTabBtn active={activeTab === 'overview'} onClick={() => switchTab('overview')} icon={<LayoutDashboard size={22}/>} label="Home" />
         <MobileTabBtn active={activeTab === 'orders'} onClick={() => switchTab('orders')} icon={<ShoppingBag size={22}/>} label="Orders" />
         <MobileTabBtn active={activeTab === 'profile'} onClick={() => switchTab('profile')} icon={<User size={22}/>} label="Profile" />
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto mb-24 lg:mb-0 bg-gray-50/40">
        <header className="mb-10 border-b border-gray-100 pb-10">
          <div className="flex items-center gap-2 text-gold mb-3">
            <Shield size={12} />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Authenticated Client</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-black tracking-tight leading-none uppercase">
            {activeTab === 'overview' && `Hello, ${profile?.full_name?.split(' ')[0] || 'Client'}`}
            {activeTab === 'orders' && 'Acquisition History'}
            {activeTab === 'profile' && 'Personal Registry'}
          </h1>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'overview' && <OverviewTab profile={profile} />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'profile' && <ProfileTab profile={profile} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  )
}

/** COMPONENT HELPERS **/

function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all group ${
        active 
        ? 'bg-black text-white shadow-xl scale-[1.02]' 
        : 'text-gray-400 hover:text-black hover:bg-white hover:shadow-sm'
      }`}
    >
      <div className={`${active ? 'text-gold' : 'text-gray-300 group-hover:text-gold'} transition-colors`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{label}</span>
    </button>
  )
}

function MobileTabBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-black scale-110' : 'text-gray-300'}`}>
      <div className={`p-2.5 rounded-xl ${active ? 'bg-black text-gold shadow-lg' : ''} transition-all`}>
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  )
}

function MenuLink({ icon, label, onClick, highlight }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all shadow-sm ${
        highlight ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-100 text-black active:bg-gold active:text-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={highlight ? "text-gold" : "text-gold"}>{icon}</div>
        <span className="text-[11px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <ArrowRight size={16} className={highlight ? "text-white/40" : "text-gray-300"} />
    </button>
  )
}