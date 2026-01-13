'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, ArrowRight, Clock, Gem } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function OverviewTab({ profile }: { profile: any }) {
  const supabase = createClient() // AUDIT FIX: Initialize factory once
  const [stats, setStats] = useState({ totalValue: 0, itemCount: 0 })
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [recentPurchases, setRecentPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOverviewData() {
      if (!profile?.id) return

      try {
        // 1. Fetch orders using the browser client
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', profile.id)
          .neq('status', 'cancelled')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (orders) {
          // Calculate stats: Value is based on all successful acquisitions
          const deliveredOrders = orders.filter(o => o.status === 'delivered')
          const total = deliveredOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0)
          
          setStats({
            totalValue: total,
            itemCount: deliveredOrders.length
          })

          // 2. Identify active shipments
          const inTransit = orders.find(o => ['confirmed', 'dispatched', 'shipped'].includes(o.status))
          setActiveOrder(inTransit)

          // 3. History preview
          setRecentPurchases(orders.slice(0, 3))
        }
      } catch (err) {
        console.error("Vault sync error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()
  }, [profile?.id, supabase])

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm gap-4">
      <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">Synchronizing Portfolio...</p>
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* I. COLLECTION VALUE & ACTIVE STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PORTFOLIO VALUE CARD */}
        <div className="lg:col-span-2 p-8 md:p-12 bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gold" size={14} />
                <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Portfolio Value</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-black font-serif italic tracking-tight break-words">
                ${stats.totalValue.toLocaleString()}<span className="text-xl md:text-2xl text-gray-200 not-italic font-sans">.00</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
               <StatItem label="Owned" value={`${stats.itemCount} Items`} />
               <StatItem label="Verified" value="100% Secure" />
               <div className="hidden md:block">
                  <StatItem label="Client Since" value={new Date(profile?.created_at).getFullYear().toString()} />
               </div>
            </div>
          </div>
        </div>

        {/* ACTIVE SHIPMENT CARD */}
        <div className="p-8 bg-black rounded-3xl text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gold/[0.03] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                 <Truck size={16} className="text-gold" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gold">
                   {activeOrder ? 'Active Shipment' : 'Status: Ready'}
                 </span>
              </div>
              
              {activeOrder ? (
                <>
                  <h3 className="text-xl font-bold font-serif italic leading-tight">
                    Order <span className="text-gold font-sans font-bold not-italic uppercase">{activeOrder.tracking_number}</span> is currently in transit.
                  </h3>
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Global Vault Delivery</p>
                </>
              ) : (
                <h3 className="text-xl font-bold font-serif italic leading-tight text-gray-400">
                  Your vault is up to date. Ready for a new <span className="text-white">acquisition?</span>
                </h3>
              )}
            </div>

            {activeOrder && (
              <button className="relative z-10 flex items-center justify-between w-full p-4 bg-white/10 border border-white/5 rounded-xl group hover:bg-gold hover:text-black transition-all duration-500">
                <span className="text-[10px] font-bold uppercase tracking-widest">Track Journey</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
        </div>
      </div>

      {/* II. RECENT ACTIVITY & VERIFICATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* RECENT ACTIVITY LIST */}
        <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-gray-50 pb-6">
            <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Recent Activity</h4>
            <Clock size={14} className="text-gold" />
          </div>
          
          <div className="space-y-6">
            {recentPurchases.length > 0 ? recentPurchases.map((order) => (
              <RecentRow 
                key={order.id}
                name={order.items?.[0]?.name || 'Luxury Asset'} 
                date={new Date(order.created_at).toLocaleDateString()} 
                price={`$${(Number(order.total_price) || 0).toLocaleString()}`} 
              />
            )) : (
              <p className="text-[10px] font-bold text-gray-300 uppercase text-center py-6">No recent records</p>
            )}
          </div>
        </div>

        {/* TRUST & INSPECTION CARD */}
        <div className="p-8 bg-gray-50 rounded-3xl flex flex-col justify-center items-center text-center space-y-6 border border-gray-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gold border border-gold/5">
            <Gem size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest">Verified Authenticity</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto font-medium uppercase tracking-tight">
              Every asset is hand-inspected and verified by our master specialists before being added to your portfolio.
            </p>
          </div>
          <div className="flex gap-2">
             <div className="w-1 h-1 rounded-full bg-gold/20" />
             <div className="w-1 h-1 rounded-full bg-gold" />
             <div className="w-1 h-1 rounded-full bg-gold/20" />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm md:text-lg font-bold text-black uppercase tracking-tight">{value}</p>
    </div>
  )
}

function RecentRow({ name, date, price }: { name: string, date: string, price: string }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer transition-all">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/20 group-hover:bg-gold transition-colors shrink-0" />
        <div className="overflow-hidden">
          <p className="text-[11px] font-bold text-black uppercase tracking-tight group-hover:text-gold transition-colors truncate">{name}</p>
          <p className="text-[9px] text-gray-400 font-bold">{date}</p>
        </div>
      </div>
      <p className="text-[11px] font-bold text-black font-sans shrink-0">{price}</p>
    </div>
  )
}