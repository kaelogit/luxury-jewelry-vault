'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, ArrowRight, ShoppingBag, Landmark, Clock } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

interface OverviewTabProps {
  profile: Profile | null
}

export default function OverviewTab({ profile }: OverviewTabProps) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* I. TOP LEVEL STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ASSET VALUATION */}
        <div className="lg:col-span-2 p-10 bg-white border border-ivory-300 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Landmark className="text-gold" size={16} />
                <p className="label-caps !text-[10px] text-gold">Total Collection Value</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-medium text-obsidian-900 font-serif italic tracking-tight">
                $1,240,500<span className="text-2xl text-obsidian-300 not-italic">.00</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 border-t border-ivory-100">
               <StatItem label="Curated Items" value="14 Pieces" />
               <StatItem label="Gold Weight" value="850g" />
               <div className="hidden md:block">
                  <StatItem label="Member Since" value="2026" />
               </div>
            </div>
          </div>
        </div>

        {/* ACTIVE SHIPPING CARD */}
        <div className="p-10 bg-obsidian-900 rounded-2xl text-white space-y-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
           <div className="absolute inset-0 bg-gold/[0.03] pointer-events-none" />
           
           <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-2 opacity-60">
                 <Truck size={16} className="text-gold" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gold">In Transit</span>
              </div>
              <h3 className="text-2xl font-medium font-serif italic leading-tight">
                Your <span className="text-gold not-italic">Heritage Watch</span> is currently arriving via Express Courier.
              </h3>
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Est. Arrival: Jan 08</p>
           </div>

           <button className="relative z-10 flex items-center justify-between w-full p-4 bg-white/10 border border-white/10 rounded-lg group hover:bg-gold transition-all duration-300">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Track Delivery</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>

      {/* II. RECENT ACTIVITY & TRUST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* RECENT PURCHASES MINI-LIST */}
        <div className="p-8 bg-white border border-ivory-300 rounded-2xl shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-ivory-100 pb-4">
            <h4 className="label-caps text-obsidian-900">Recent Acquisitions</h4>
            <Clock size={14} className="text-gold" />
          </div>
          
          <div className="space-y-4">
            <RecentRow name="Byzantium 24K Ring" date="Dec 28, 2025" price="$4,200" />
            <RecentRow name="Sovereign Gold Chain" date="Nov 15, 2025" price="$12,500" />
          </div>
        </div>

        {/* SERVICE ADVISORY */}
        <div className="p-8 bg-ivory-50 border border-ivory-300 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
          <ShieldCheck size={24} className="text-gold" />
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-obsidian-900 uppercase tracking-widest">Authentication Active</h4>
            <p className="text-[11px] text-obsidian-500 leading-relaxed max-w-xs">
              Every item in your collection has been physically verified and paired with digital GIA documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-obsidian-400 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-medium text-obsidian-900 font-serif italic leading-none">{value}</p>
    </div>
  )
}

function RecentRow({ name, date, price }: { name: string, date: string, price: string }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
      <div>
        <p className="text-xs font-bold text-obsidian-900 uppercase tracking-tight group-hover:text-gold transition-colors">{name}</p>
        <p className="text-[10px] text-obsidian-400 font-medium">{date}</p>
      </div>
      <p className="text-xs font-bold text-obsidian-900">{price}</p>
    </div>
  )
}