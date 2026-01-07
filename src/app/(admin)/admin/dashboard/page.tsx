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
  Landmark,
  ShoppingBag,
  Clock,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-10">
      {/* 1. HEADER */}
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-obsidian-900 font-serif italic">
          Vault <span className="text-gold not-italic">Analytics.</span>
        </h2>
        <p className="label-caps text-obsidian-400">Operational Overview & Asset Performance</p>
      </header>

      {/* 2. CORE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Revenue" 
          value="$842,500" 
          change="+14.2%" 
          trend="up" 
          icon={<Landmark size={20} />} 
        />
        <StatCard 
          label="Pending Orders" 
          value="08" 
          change="+3" 
          trend="up" 
          icon={<ShoppingBag size={20} />} 
        />
        <StatCard 
          label="Active Clients" 
          value="142" 
          change="+12" 
          trend="up" 
          icon={<Users size={20} />} 
        />
        <StatCard 
          label="System Status" 
          value="SECURE" 
          icon={<ShieldCheck size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. LIVE ORDER FEED */}
        <div className="lg:col-span-2 bg-white border border-ivory-300 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-ivory-100">
            <h3 className="label-caps text-obsidian-900">Recent Transactions</h3>
            <button className="text-[10px] text-gold hover:underline uppercase font-bold tracking-widest transition-all">
              View Ledger
            </button>
          </div>
          
          <div className="space-y-6">
            <ActivityRow 
              title="New Acquisition" 
              desc="Order #LV-9921 for 18K Gold Cuban Link ($12,400)" 
              time="4 mins ago" 
              status="Pending Wire" 
            />
            <ActivityRow 
              title="Payment Verified" 
              desc="BTC Transfer confirmed for 'Vintage Daytona'" 
              time="28 mins ago" 
              status="Processing" 
            />
            <ActivityRow 
              title="Logistics Update" 
              desc="Shipment #7721 departed Zurich Hub" 
              time="2 hours ago" 
              status="In Transit" 
            />
            <ActivityRow 
              title="New Client Registered" 
              desc="Member from United Arab Emirates" 
              time="5 hours ago" 
              status="Review" 
            />
          </div>
        </div>

        {/* 4. INVENTORY COMPOSITION */}
        <div className="bg-white border border-ivory-300 rounded-2xl p-8 space-y-8 shadow-sm">
          <h3 className="label-caps text-obsidian-900">Vault Distribution</h3>
          
          <div className="space-y-8">
            <ProgressBar label="Timepieces" percentage={45} color="bg-obsidian-900" />
            <ProgressBar label="Solid Gold" percentage={35} color="bg-gold" />
            <ProgressBar label="Loose Diamonds" percentage={20} color="bg-ivory-400" />
          </div>

          <div className="pt-6 border-t border-ivory-100">
             <div className="p-4 bg-ivory-50 rounded-xl space-y-2">
                <p className="text-[10px] font-bold text-obsidian-400 uppercase tracking-widest">Action Required</p>
                <p className="text-xs text-obsidian-900 font-medium">3 GIA Certificates pending upload for recent diamond intake.</p>
                <button className="text-[10px] text-gold font-bold uppercase hover:underline flex items-center gap-1">
                    Resolve Now <ChevronRight size={10} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** * UI COMPONENT: Metric Card 
 */
function StatCard({ label, value, change, trend, icon }: any) {
  return (
    <div className="bg-white border border-ivory-300 p-8 rounded-2xl hover:border-gold transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="text-gold group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        {change && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase text-obsidian-400 font-bold tracking-widest mb-1">{label}</p>
      <h4 className="text-3xl font-medium text-obsidian-900 font-serif italic">{value}</h4>
    </div>
  )
}

/** * UI COMPONENT: Activity Row
 */
function ActivityRow({ title, desc, time, status }: any) {
  return (
    <div className="flex items-center justify-between group cursor-pointer py-2">
      <div className="space-y-1">
        <h5 className="text-[11px] font-bold text-obsidian-900 uppercase tracking-wider">{title}</h5>
        <p className="text-xs text-obsidian-500 font-medium">{desc}</p>
        <p className="text-[9px] text-obsidian-300 font-bold uppercase tracking-widest">{time}</p>
      </div>
      <div className="text-right">
         <span className="text-[9px] font-black text-gold border border-gold/20 px-2 py-1 rounded-full uppercase tracking-widest">{status}</span>
      </div>
    </div>
  )
}

/** * UI COMPONENT: Progress Bar
 */
function ProgressBar({ label, percentage, color }: any) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-obsidian-600">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-ivory-100 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={`h-full ${color}`} 
                />
            </div>
        </div>
    )
}