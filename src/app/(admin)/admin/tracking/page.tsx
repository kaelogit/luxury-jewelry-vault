'use client'

import React, { useState } from 'react'
import { 
  Truck, ShieldCheck, MapPin, Package, 
  ClipboardCheck, UserCheck, Globe, Clock, 
  ChevronRight, Box, Navigation, Zap
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SovereignTracking() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  // Placeholder Manifest - Real data should come from your 'logistics' table
  const activeDeliveries = [
    { id: 'LV-9928', item: '24K Solid Gold Cuban Link', client: 'Jonathan Wick', status: 'IN TRANSIT', value: '$52,000' },
    { id: 'LV-9930', item: '5.0ct VVS1 Round Brilliant', client: 'S. Nakamoto', status: 'IN VAULT', value: '$85,400' },
  ]

  return (
    <div className="space-y-12 pb-10 selection:bg-gold selection:text-white">
      
      {/* 1. LOGISTICS HEADER */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_gold] animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-light text-obsidian-900 italic tracking-tighter">
            Chain of <span className="text-obsidian-400">Custody.</span>
          </h2>
        </div>
        <p className="text-obsidian-400 font-black tracking-[0.4em] uppercase text-[10px] italic border-l-2 border-gold pl-6">
          Global Logistics & Physical Asset Tracking Protocol
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. SHIPMENT MANIFEST (LEFT) */}
        <div className="space-y-6">
          <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black italic">Active Shipments</h3>
          <div className="space-y-4">
            {activeDeliveries.map((order) => (
              <motion.div 
                whileHover={{ x: 5 }}
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`p-8 bg-white border rounded-[2.5rem] cursor-pointer transition-all duration-500 shadow-sm ${
                  selectedOrder?.id === order.id 
                  ? 'border-gold bg-ivory-50 ring-1 ring-gold/20' 
                  : 'border-ivory-300 hover:border-gold/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-bold text-obsidian-300 uppercase tracking-tighter">{order.id}</span>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                    order.status === 'IN TRANSIT' ? 'bg-gold text-white shadow-[0_0_10px_gold/20]' : 'bg-ivory-200 text-obsidian-400'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <h4 className="text-md font-black text-obsidian-900 uppercase tracking-tight mb-2 italic leading-tight">{order.item}</h4>
                <div className="flex items-center gap-2 text-obsidian-400">
                  <UserCheck size={12} className="text-gold" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">{order.client}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. TIMELINE COMMAND (RIGHT) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div 
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-ivory-300 rounded-[3.5rem] p-10 md:p-14 shadow-2xl relative overflow-hidden"
              >
                {/* Visual Accent */}
                <Globe className="absolute -right-10 -top-10 text-gold opacity-[0.03] w-64 h-64" />

                <div className="flex justify-between items-start mb-16 pb-8 border-b border-ivory-200">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-light text-obsidian-900 italic tracking-tighter">Timeline Management</h3>
                    <p className="text-[10px] text-obsidian-400 uppercase tracking-widest font-black italic">Syncing Updates with Client Node: {selectedOrder.id}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] text-gold font-black uppercase tracking-[0.4em]">Asset Valuation</p>
                    <p className="text-2xl font-mono font-bold text-obsidian-900 italic">{selectedOrder.value}</p>
                  </div>
                </div>

                {/* UPDATE INGRESS FORM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 p-10 bg-ivory-50 border border-gold/10 rounded-[3rem] shadow-inner">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase text-obsidian-400 font-black tracking-widest ml-4 italic">Update Milestone</label>
                    <select className="w-full bg-white border border-ivory-300 p-5 rounded-2xl text-[11px] font-bold text-obsidian-900 uppercase tracking-widest outline-none focus:border-gold transition-all appearance-none shadow-sm">
                      <option>Undergoing Final Polish</option>
                      <option>Gemologist Inspection Passed</option>
                      <option>Secured in Transit Case</option>
                      <option>Out for Private Delivery</option>
                      <option>Hand-Delivered to Client</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase text-obsidian-400 font-black tracking-widest ml-4 italic">Current Coordinates</label>
                    <div className="relative">
                      <Navigation className="absolute left-5 top-1/2 -translate-y-1/2 text-gold" size={14} />
                      <input type="text" placeholder="e.g. LUME DEPOT, ZURICH" className="w-full bg-white border border-ivory-300 p-5 pl-14 rounded-2xl text-[11px] text-obsidian-900 uppercase font-black outline-none focus:border-gold shadow-sm" />
                    </div>
                  </div>
                  <button className="md:col-span-2 py-6 bg-obsidian-900 text-gold text-[11px] font-black uppercase tracking-[0.4em] rounded-[1.5rem] hover:bg-gold hover:text-white transition-all duration-500 shadow-xl flex items-center justify-center gap-4 group">
                    Finalize Logistics Update <Zap size={14} className="group-hover:scale-125 transition-transform" />
                  </button>
                </div>

                {/* CHAIN OF CUSTODY TIMELINE */}
                <div className="space-y-10 relative before:absolute before:left-[17px] before:top-4 before:bottom-4 before:w-[1px] before:bg-gold/20">
                  <TimelineItem 
                    icon={<ClipboardCheck size={16}/>} 
                    title="Final Gemologist Appraisal" 
                    location="Manhattan Headquarters" 
                    time="JAN 04, 2026 - 09:12 AM" 
                    active 
                  />
                  <TimelineItem 
                    icon={<ShieldCheck size={16}/>} 
                    title="Secured in Armored Vault" 
                    location="Secure Depot, NYC" 
                    time="JAN 03, 2026 - 04:30 PM" 
                  />
                  <TimelineItem 
                    icon={<Package size={16}/>} 
                    title="Packaging Protocol Initiated" 
                    location="Lume Vault HQ" 
                    time="JAN 03, 2026 - 11:20 AM" 
                  />
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-obsidian-200 h-full border border-ivory-300 border-dashed rounded-[4rem] bg-white">
                <Truck size={80} className="mb-6 opacity-10" />
                <p className="text-[12px] uppercase tracking-[0.6em] font-black italic">Select Manifest to Inspect Logistics</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ icon, title, location, time, active = false }: any) {
  return (
    <div className="flex gap-8 relative group">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-all duration-700 shadow-sm ${
        active 
        ? 'bg-obsidian-900 text-gold border-gold scale-110 shadow-gold/20' 
        : 'bg-ivory-100 text-obsidian-300 border-ivory-300'
      }`}>
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h4 className={`text-sm font-black uppercase tracking-tight italic ${active ? 'text-obsidian-900' : 'text-obsidian-300'}`}>
          {title}
        </h4>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center gap-2 text-[10px] text-obsidian-400 font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-gold" /> {location}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-obsidian-300 font-mono italic font-bold">
            <Clock size={12} /> {time}
          </div>
        </div>
      </div>
    </div>
  )
}