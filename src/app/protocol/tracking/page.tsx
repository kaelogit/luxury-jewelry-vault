'use client'

import React, { useState } from 'react'
import { 
  ShieldCheck, MapPin, Package, ClipboardCheck, 
  Search, Truck, ArrowRight, Loader2, Fingerprint, Globe 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PublicTracking() {
  const [orderId, setOrderId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [trackingData, setTrackingData] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setTrackingData(null)
    
    // SOVEREIGN HANDSHAKE SIMULATION
    setTimeout(() => {
      if (orderId.toUpperCase() === 'LV-9928') {
        setTrackingData({
          id: 'LV-9928',
          item: '24K Solid Gold Cuban Link',
          status: 'IN TRANSIT',
          eta: 'JAN 06, 2026',
          logs: [
            { icon: <Globe size={16}/>, title: "Customs Clearances Verified", location: "Zurich International", time: "JAN 05, 02:12 PM", current: true },
            { icon: <ClipboardCheck size={16}/>, title: "Gemologist Audit Complete", location: "Manhattan HQ", time: "JAN 04, 09:12 AM", current: false },
            { icon: <ShieldCheck size={16}/>, title: "Vault Custody Transfer", location: "Secure Depot, NYC", time: "JAN 03, 04:30 PM", current: false },
            { icon: <Package size={16}/>, title: "Payment Settlement Finalized", location: "Lume Vault Node", time: "JAN 03, 11:20 AM", current: false },
          ]
        })
      }
      setIsSearching(false)
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-40 pb-32 px-6 selection:bg-gold selection:text-white">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* I. HEADER PROTOCOL */}
        <header className="text-center space-y-8 mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-white border border-gold/20 rounded-full shadow-sm"
          >
             <ShieldCheck size={14} className="text-gold" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic">Custody Verification Active</span>
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-light text-obsidian-900 tracking-tighter italic leading-none">
              Asset <span className="text-obsidian-400">Audit.</span>
            </h1>
            <p className="text-obsidian-500 text-[11px] font-black uppercase tracking-[0.3em] max-w-md mx-auto italic">
              Verify the physical chain of custody for your acquisition.
            </p>
          </div>
        </header>

        {/* II. SECURE SEARCH INGRESS */}
        <section className="relative">
          <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gold/10 blur-2xl rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input 
              type="text" 
              placeholder="ENTER TRACKING IDENTIFIER..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="relative w-full bg-white border border-ivory-300 rounded-3xl py-8 px-10 text-obsidian-900 font-mono text-xl outline-none focus:border-gold/40 transition-all placeholder:text-ivory-400 shadow-xl"
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-4 top-4 bottom-4 px-10 bg-obsidian-900 text-gold rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isSearching ? <Loader2 className="animate-spin" size={14}/> : 'Verify'} <ArrowRight size={14} />
            </button>
          </form>
        </section>

        {/* III. AUDIT RESULTS DISPLAY */}
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {trackingData ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-ivory-300 rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gold/20" />
                
                <div className="flex flex-col md:flex-row justify-between gap-10 mb-16 border-b border-ivory-100 pb-12">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Current Assignment</p>
                    <h2 className="text-3xl font-light text-obsidian-900 italic tracking-tighter uppercase">{trackingData.item}</h2>
                    <div className="inline-flex px-4 py-1 bg-ivory-50 border border-ivory-200 rounded-full font-mono text-[10px] text-obsidian-400">
                      SIG_{trackingData.id}
                    </div>
                  </div>
                  <div className="text-left md:text-right space-y-4">
                    <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic">Expected Release</p>
                    <p className="text-3xl font-mono text-obsidian-900 tracking-tighter">{trackingData.eta}</p>
                  </div>
                </div>

                {/* TIMELINE AUDIT GRID */}
                <div className="space-y-12 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[1px] before:bg-ivory-200">
                  {trackingData.logs.map((log: any, i: number) => (
                    <TimelineItem key={i} {...log} delay={i * 0.1} />
                  ))}
                </div>

                <div className="mt-16 pt-10 border-t border-ivory-100 flex justify-between items-center opacity-40">
                   <div className="flex items-center gap-3">
                      <Fingerprint size={16} className="text-gold" />
                      <span className="text-[9px] font-black text-obsidian-900 uppercase tracking-widest">Biometric Checkpoint Active</span>
                   </div>
                   <span className="text-[9px] font-mono text-obsidian-300 uppercase italic">Ver. 8.02.1</span>
                </div>
              </motion.div>
            ) : (
              !isSearching && orderId && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-10">
                  <div className="w-16 h-16 bg-white border border-ivory-300 rounded-full flex items-center justify-center mx-auto mb-6 opacity-20">
                     <Search size={24} className="text-obsidian-900" />
                  </div>
                  <p className="text-[11px] font-black text-obsidian-300 uppercase tracking-[0.5em] italic">Signature Not Found in Registry</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

function TimelineItem({ icon, title, location, time, current, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className="flex gap-10 relative group"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-700 ${
        current 
        ? 'bg-gold text-white border-gold shadow-[0_0_25px_gold]' 
        : 'bg-white text-ivory-400 border-ivory-200 group-hover:border-gold/30'
      }`}>
        {icon}
      </div>
      <div className="space-y-3 pt-1">
        <h4 className={`text-lg font-light tracking-tight italic uppercase ${current ? 'text-obsidian-900' : 'text-obsidian-300'}`}>
          {title}
        </h4>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex items-center gap-3 text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-gold/50" /> {location}
          </div>
          <div className="text-[10px] text-obsidian-200 font-mono font-black italic">
            {time}
          </div>
        </div>
      </div>
    </motion.div>
  )
}