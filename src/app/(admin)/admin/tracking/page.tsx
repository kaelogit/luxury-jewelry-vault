'use client'

import React, { useState, useEffect } from 'react'
import { 
  Truck, ShieldCheck, MapPin, Package, 
  ClipboardCheck, UserCheck, Globe, Clock, 
  ChevronRight, Box, Navigation, Zap, Search, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function AdminLogistics() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // I. SYNC ACTIVE SHIPMENTS
  useEffect(() => {
    const fetchLogistics = async () => {
      // Fetching orders that are in 'logistics' or 'verifying' phase
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['verifying', 'logistics', 'delivered'])
        .order('updated_at', { ascending: false })

      if (data) setDeliveries(data)
      setLoading(false)
    }

    fetchLogistics()
    
    // Real-time listener for logistics updates
    const channel = supabase.channel('logistics-sync').on('postgres_changes', { 
      event: '*', schema: 'public', table: 'orders' 
    }, () => fetchLogistics()).subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const updateLogistics = async (status: string) => {
    if (!selectedOrder) return
    
    const { error } = await supabase
      .from('orders')
      .update({ status: status.toLowerCase() })
      .eq('id', selectedOrder.id)

    if (!error) {
      // In a real scenario, you'd also insert into a 'tracking_history' table here
      alert('Logistics Milestone Updated')
    }
  }

  if (loading) return (
    <div className="h-screen bg-ivory-50 flex flex-col items-center justify-center gap-4">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="label-caps text-obsidian-400">Syncing Global Hubs</p>
    </div>
  )

  return (
    <div className="space-y-10 pb-20">
      
      {/* HEADER */}
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-obsidian-900 font-serif italic">
          Logistics <span className="text-gold not-italic">Desk.</span>
        </h2>
        <p className="label-caps text-obsidian-400">Physical Asset Tracking & Fulfillment</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. ACTIVE MANIFEST (LEFT) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="label-caps text-obsidian-900">Active Manifests</h3>
            <div className="p-2 bg-white border border-ivory-300 rounded-lg">
                <Search size={14} className="text-obsidian-300" />
            </div>
          </div>

          <div className="space-y-3">
            {deliveries.map((order) => (
              <div 
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-6 bg-white border rounded-xl cursor-pointer transition-all duration-300 shadow-sm ${
                  selectedOrder?.id === order.id 
                  ? 'border-gold bg-ivory-50 ring-1 ring-gold/10' 
                  : 'border-ivory-300 hover:border-gold'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-mono font-bold text-obsidian-300 uppercase tracking-widest">#{order.id.slice(0,8)}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                    order.status === 'logistics' ? 'bg-gold text-white' : 'bg-ivory-200 text-obsidian-500'
                  }`}>
                    {order.status === 'logistics' ? 'In Transit' : order.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-tight mb-2 truncate">
                    {order.items?.[0]?.name || 'Luxury Selection'}
                </h4>
                <div className="flex items-center gap-2 text-obsidian-400">
                  <UserCheck size={12} className="text-gold" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">{order.client_name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TRACKING TERMINAL (RIGHT) */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="bg-white border border-ivory-300 rounded-2xl p-10 shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-12 pb-8 border-b border-ivory-100">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-medium text-obsidian-900 font-serif italic">Dispatch Control</h3>
                    <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">Client Ref: {selectedOrder.id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Insurance Value</p>
                    <p className="text-2xl font-medium text-obsidian-900 font-serif italic">${Number(selectedOrder.total_price || selectedOrder.total_valuation).toLocaleString()}</p>
                  </div>
                </div>

                {/* UPDATE ACTION GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 p-8 bg-ivory-50 rounded-xl border border-ivory-200">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400 ml-1">New Milestone</label>
                    <select 
                        onChange={(e) => updateLogistics(e.target.value)}
                        className="w-full bg-white border border-ivory-300 p-3 rounded-lg text-[10px] font-bold text-obsidian-900 uppercase tracking-widest outline-none focus:border-gold"
                    >
                      <option value="">Update Phase...</option>
                      <option value="verifying">Verification Process</option>
                      <option value="logistics">Release to Courier</option>
                      <option value="delivered">Confirmed Delivery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400 ml-1">Current Hub</label>
                    <div className="relative">
                      <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gold" size={14} />
                      <input type="text" placeholder="e.g. ZURICH DEPOT" className="w-full bg-white border border-ivory-300 p-3 pl-10 rounded-lg text-[10px] text-obsidian-900 uppercase font-bold outline-none focus:border-gold" />
                    </div>
                  </div>
                </div>

                {/* LIVE TRACKING TIMELINE */}
                <div className="space-y-8 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:bg-ivory-200">
                  <TimelineStep 
                    icon={<Truck size={14}/>} 
                    title="Courier Dispatched" 
                    location="Vault HQ, NYC" 
                    time="Current Status" 
                    active 
                  />
                  <TimelineStep 
                    icon={<ShieldCheck size={14}/>} 
                    title="Authentication Handover" 
                    location="Secure Depot" 
                    time="Jan 06, 2026" 
                  />
                  <TimelineStep 
                    icon={<Package size={14}/>} 
                    title="Order Processed" 
                    location="Lume Vault" 
                    time="Jan 05, 2026" 
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-obsidian-200 h-full border border-ivory-300 border-dashed rounded-2xl bg-white p-20">
                <Truck size={48} className="mb-4 opacity-20" />
                <p className="label-caps text-obsidian-300">Select a manifest to manage logistics</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TimelineStep({ icon, title, location, time, active = false }: any) {
  return (
    <div className="flex gap-6 relative group">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all duration-500 shadow-sm ${
        active 
        ? 'bg-obsidian-900 text-gold border-gold' 
        : 'bg-white text-obsidian-300 border-ivory-300'
      }`}>
        {icon}
      </div>
      <div className="flex flex-col">
        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${active ? 'text-obsidian-900' : 'text-obsidian-400'}`}>
          {title}
        </h4>
        <div className="flex gap-4 items-center mt-1">
          <div className="flex items-center gap-1.5 text-[9px] text-obsidian-400 font-bold uppercase tracking-widest">
            <MapPin size={10} className="text-gold" /> {location}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-obsidian-300 font-medium uppercase tracking-widest">
            <Clock size={10} /> {time}
          </div>
        </div>
      </div>
    </div>
  )
}