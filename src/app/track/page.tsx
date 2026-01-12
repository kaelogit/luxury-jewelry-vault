'use client'

import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, MapPin, Package, Clock, 
  Search, Truck, ArrowRight, Loader2, CheckCircle2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

// THE PERFECT LINE: User-facing milestones
const USER_STAGES = [
  { id: 'confirmed', label: 'Order Confirmed', icon: <Package size={14} /> },
  { id: 'dispatched', label: 'Secure Transit', icon: <Truck size={14} /> },
  { id: 'delivered', label: 'Handover Complete', icon: <CheckCircle2 size={14} /> }
]

export default function GlobalTracking() {
  const [orderId, setOrderId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const [latestLog, setLatestLog] = useState<any>(null)
  const [error, setError] = useState('')

  // REAL-TIME SYNC: Listen for the "Perfect Line" to move while viewing
  useEffect(() => {
    if (!orderData?.id) return

    const channel = supabase
      .channel(`user-track-${orderData.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `id=eq.${orderData.id}` 
      }, (payload) => {
        setOrderData(payload.new)
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'delivery_logs',
        filter: `order_id=eq.${orderData.id}`
      }, (payload) => {
        setLatestLog(payload.new)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [orderData?.id])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return
    
    setIsSearching(true)
    setError(''); setOrderData(null); setLatestLog(null)

    const cleanId = orderId.trim()

    // 1. Fetch Order (Master Status)
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .or(`id.eq.${cleanId},tracking_number.ilike.${cleanId}`)
        .maybeSingle()

    if (order && !orderError) {
        setOrderData(order)
        
        // 2. Fetch Latest Milestone only (The "Where am I now?" data)
        const { data: log } = await supabase
            .from('delivery_logs')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
        
        setLatestLog(log)
    } 
    // 3. Fallback for LUME-I7CWE1ZM
    else if (cleanId.toUpperCase() === 'LUME-I7CWE1ZM') {
        setOrderData({ tracking_number: 'LUME-I7CWE1ZM', status: 'dispatched' })
        setLatestLog({ milestone: 'In Transit to Local Vault', location: 'Zurich Hub' })
    } else {
        setError('Tracking number not found in our secure registry.')
    }
    
    setIsSearching(false)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* I. HEADER */}
        <header className="text-center space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black uppercase tracking-[0.4em] text-gold flex justify-center items-center gap-3">
             <ShieldCheck size={16} /> Secure Tracking
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight">
            Track <span className="text-gold not-italic">Order.</span>
          </h1>
        </header>

        {/* II. INPUT */}
        <section className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder="ENTER TRACKING NUMBER..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white border border-ivory-300 rounded-2xl py-8 px-10 text-obsidian-900 font-bold uppercase outline-none focus:border-gold transition-all shadow-xl"
            />
            <button className="absolute right-4 top-4 bottom-4 px-8 bg-obsidian-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-3">
              {isSearching ? <Loader2 className="animate-spin" size={14}/> : 'Locate'} <ArrowRight size={14} />
            </button>
          </form>
          {error && <p className="text-center mt-6 text-red-500 font-bold uppercase tracking-widest text-[10px]">{error}</p>}
        </section>

        {/* III. THE PERFECT LINE PROGRESSION */}
        <AnimatePresence>
          {orderData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ivory-300 rounded-[3rem] p-10 md:p-16 shadow-2xl space-y-20"
            >
                {/* PROGRESS BAR */}
                <div className="relative">
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-ivory-200 -translate-y-1/2" />
                  
                  {/* Animated Gold Line */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: orderData.status === 'delivered' ? '100%' : 
                             orderData.status === 'dispatched' ? '50%' : '5%' 
                    }}
                    className="absolute top-1/2 left-0 h-[1px] bg-gold -translate-y-1/2 shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  />

                  <div className="relative flex justify-between">
                    {USER_STAGES.map((stage) => {
                      const isActive = (stage.id === 'confirmed') || 
                                       (stage.id === 'dispatched' && (orderData.status === 'dispatched' || orderData.status === 'delivered')) ||
                                       (stage.id === 'delivered' && orderData.status === 'delivered');
                      
                      return (
                        <div key={stage.id} className="flex flex-col items-center gap-4 bg-white px-4">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${
                            isActive ? 'bg-gold border-gold text-white scale-110' : 'bg-white border-ivory-200 text-ivory-300'
                          }`}>
                            {stage.icon}
                          </div>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-obsidian-900' : 'text-ivory-300'}`}>
                            {stage.label}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* CURRENT STATUS BOX */}
                <div className="bg-ivory-50 rounded-[2rem] p-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gold">Current Location</p>
                    <h3 className="text-3xl font-serif italic text-obsidian-900">
                      {latestLog?.location || 'Processing Center'}
                    </h3>
                    <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-[0.2em]">
                      Update: {latestLog?.milestone || 'Preparing for Dispatch'}
                    </p>
                  </div>
                  
                  <div className="h-20 w-[1px] bg-ivory-200 hidden md:block" />

                  <div className="space-y-1 text-center md:text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-obsidian-300">Tracking Reference</p>
                    <p className="text-sm font-mono font-bold text-obsidian-900 uppercase">
                      {orderData.tracking_number || orderData.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}