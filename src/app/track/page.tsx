'use client'

import React, { useState } from 'react'
import { 
  ShieldCheck, MapPin, Package, ClipboardCheck, 
  Search, Truck, ArrowRight, Loader2, Globe, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function GlobalTracking() {
  const [orderId, setOrderId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [trackingData, setTrackingData] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderId) return
    
    setIsSearching(true)
    setError('')
    setTrackingData(null)

    // REAL-TIME REGISTRY LOOKUP
    const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.toLowerCase())
        .single()

    if (fetchError || !data) {
        // Fallback for your demo/testing if you use 'LV-9928'
        if (orderId.toUpperCase() === 'LV-9928') {
            setTrackingData({
                id: 'LV-9928',
                item: '24K Solid Gold Cuban Link',
                status: 'IN TRANSIT',
                eta: 'JAN 12, 2026',
            })
        } else {
            setError('Manifest identifier not recognized.')
        }
    } else {
        setTrackingData(data)
    }
    
    setIsSearching(false)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 pb-32 px-6">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* I. HEADER */}
        <header className="text-center space-y-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label-caps text-gold flex justify-center items-center gap-3">
             <Truck size={16} /> Global Logistics
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-none">
            Track <span className="text-gold not-italic">Asset.</span>
          </h1>
          <p className="text-obsidian-500 text-sm uppercase font-bold tracking-[0.3em] max-w-md mx-auto">
            Real-time physical transit and vault custody monitoring.
          </p>
        </header>

        {/* II. INPUT AREA */}
        <section className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative group">
            <input 
              type="text" 
              placeholder="ENTER ORDER ID (e.g. LV-9928)..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full bg-white border border-ivory-300 rounded-xl py-8 px-10 text-obsidian-900 font-bold uppercase placeholder:text-ivory-300 outline-none focus:border-gold transition-all shadow-xl"
            />
            <button 
              type="submit" 
              disabled={isSearching} 
              className="absolute right-4 top-4 bottom-4 px-8 bg-obsidian-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-gold transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" size={14}/> : 'Locate'} <ArrowRight size={14} />
            </button>
          </form>
          {error && <p className="text-center mt-6 text-red-500 font-bold uppercase tracking-widest text-[10px]">{error}</p>}
        </section>

        {/* III. LIVE TIMELINE REVEAL */}
        <AnimatePresence>
          {trackingData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-ivory-300 rounded-2xl p-10 md:p-16 shadow-2xl space-y-16"
            >
                {/* STATUS BAR */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 border-b border-ivory-100 pb-12">
                  <div className="space-y-2">
                    <p className="label-caps text-gold">Current Deployment</p>
                    <h2 className="text-3xl font-medium text-obsidian-900 font-serif italic uppercase truncate max-w-md">
                        {trackingData.item || (trackingData.items?.[0]?.name) || 'Luxury Acquisition'}
                    </h2>
                    <p className="text-[10px] text-obsidian-400 font-mono">REF: {trackingData.id.toUpperCase()}</p>
                  </div>
                  <div className="text-left md:text-right space-y-2">
                    <p className="label-caps text-obsidian-300">Estimated Delivery</p>
                    <p className="text-3xl font-medium text-obsidian-900 font-serif italic">{trackingData.eta || 'Jan 15, 2026'}</p>
                  </div>
                </div>

                {/* TIMELINE */}
                <div className="space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:bg-ivory-100">
                    <TimelineStep 
                        icon={<Globe size={16}/>} 
                        title="Cleared Customs" 
                        location="Zurich International Hub" 
                        time="Jan 06, 02:12 PM" 
                        active 
                    />
                    <TimelineStep 
                        icon={<ShieldCheck size={16}/>} 
                        title="Vault Custody Handover" 
                        location="Secured Depot, NYC" 
                        time="Jan 04, 04:30 PM" 
                    />
                    <TimelineStep 
                        icon={<Package size={16}/>} 
                        title="Packaging & Appraisal" 
                        location="Lume Vault HQ" 
                        time="Jan 03, 11:20 AM" 
                    />
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function TimelineStep({ icon, title, location, time, active = false }: any) {
    return (
      <div className="flex gap-8 relative group">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border transition-all duration-700 shadow-sm ${
          active 
          ? 'bg-obsidian-900 text-gold border-gold scale-110 shadow-gold/20' 
          : 'bg-white text-obsidian-300 border-ivory-200'
        }`}>
          {icon}
        </div>
        <div className="space-y-2">
          <h4 className={`text-lg font-medium font-serif italic ${active ? 'text-obsidian-900' : 'text-obsidian-300'}`}>
            {title}
          </h4>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-[10px] text-obsidian-500 font-bold uppercase tracking-widest">
              <MapPin size={12} className="text-gold" /> {location}
            </div>
            <div className="text-[10px] text-obsidian-400 font-medium uppercase tracking-widest">
              {time}
            </div>
          </div>
        </div>
      </div>
    )
}