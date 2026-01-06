'use client'

import React from 'react'
import { 
  TrendingUp, 
  Users, 
  Package, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  Wallet,
  Gem,
  Coins
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <div className="space-y-12 pb-10">
      {/* 1. HEADER PROTOCOL */}
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-light tracking-tighter text-obsidian-900 italic">
          Vault <span className="text-gold">Intelligence.</span>
        </h2>
        <p className="text-obsidian-400 font-black tracking-[0.4em] uppercase text-[10px] italic">
          Real-time Performance & Asset Security Protocol
        </p>
      </header>

      {/* 2. TOP TIER METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Pending Settlement" 
          value="$137,400" 
          change="+12.5%" 
          trend="up" 
          icon={<Activity size={20} className="text-gold" />} 
        />
        <StatCard 
          label="Vault Valuation" 
          value="$2.4M" 
          change="+0.8%" 
          trend="up" 
          icon={<Package size={20} className="text-gold" />} 
        />
        <StatCard 
          label="Active Concierge" 
          value="12" 
          change="-2" 
          trend="down" 
          icon={<Users size={20} className="text-gold" />} 
        />
        <StatCard 
          label="Network Integrity" 
          value="OPTIMAL" 
          icon={<ShieldCheck size={20} className="text-obsidian-900" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 3. RECENT HIGH-VALUE MOVEMENTS */}
        <div className="lg:col-span-2 bg-white border border-ivory-300 rounded-[3rem] p-10 shadow-sm">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-ivory-200">
            <h3 className="text-[11px] uppercase tracking-[0.4em] text-obsidian-400 font-black italic">Recent Ledger Movements</h3>
            <button className="text-[10px] text-gold hover:text-gold-dark uppercase font-black tracking-widest transition-colors border-b border-gold/20 pb-1">
              Audit Logs
            </button>
          </div>
          
          <div className="space-y-8">
            <ActivityRow 
              title="Asset Acquisition" 
              desc="0.82 BTC inbound for '24K Cuban Link'" 
              time="2 mins ago" 
              type="payment" 
            />
            <ActivityRow 
              title="Concierge Priority" 
              desc="High-priority message from Sovereign Member" 
              time="14 mins ago" 
              type="message" 
            />
            <ActivityRow 
              title="Inventory Shift" 
              desc="Asset '5.0ct VVS1' moved to 'Secured in Transit'" 
              time="1 hour ago" 
              type="inventory" 
            />
          </div>
        </div>

        {/* 4. ASSET DISTRIBUTION PROTOCOL */}
        <div className="bg-white border border-ivory-300 rounded-[3rem] p-10 space-y-10 shadow-sm relative overflow-hidden">
          <h3 className="text-[11px] uppercase tracking-[0.4em] text-obsidian-400 font-black italic">Vault Composition</h3>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Coins size={14} className="text-gold" />
                  <span className="text-obsidian-900 italic">House of Gold</span>
                </div>
                <span className="text-gold">65%</span>
              </div>
              <div className="h-1.5 w-full bg-ivory-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '65%' }}
                  className="h-full bg-gold" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Gem size={14} className="text-obsidian-900" />
                  <span className="text-obsidian-900 italic">House of Diamond</span>
                </div>
                <span className="text-obsidian-400">35%</span>
              </div>
              <div className="h-1.5 w-full bg-ivory-200 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '35%' }}
                   className="h-full bg-obsidian-900" 
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-ivory-200">
            <div className="flex items-center gap-4 text-gold">
              <Wallet size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Wallets Synchronized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, change, trend, icon }: any) {
  return (
    <div className="bg-white border border-ivory-300 p-10 rounded-[2.5rem] hover:border-gold/30 transition-all group shadow-sm hover:shadow-xl duration-500">
      <div className="flex justify-between items-start mb-8">
        <div className="bg-ivory-100 p-4 rounded-2xl group-hover:bg-gold/10 transition-colors duration-500">
          {icon}
        </div>
        {change && (
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1 ${trend === 'up' ? 'text-gold bg-gold/5' : 'text-red-500 bg-red-500/5'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase text-obsidian-400 font-black tracking-[0.3em] mb-2">{label}</p>
      <h4 className="text-3xl font-light text-obsidian-900 tracking-tighter italic">{value}</h4>
    </div>
  )
}

function ActivityRow({ title, desc, time, type }: any) {
  return (
    <div className="flex items-center gap-8 group cursor-pointer border-l-2 border-transparent hover:border-gold pl-4 transition-all duration-300">
      <div className="flex-1">
        <h5 className="text-[11px] font-black text-obsidian-900 uppercase tracking-widest italic">{title}</h5>
        <p className="text-xs text-obsidian-400 mt-1 font-light italic">{desc}</p>
      </div>
      <span className="text-[10px] text-obsidian-400 font-mono font-bold tracking-tighter uppercase">{time}</span>
    </div>
  )
}