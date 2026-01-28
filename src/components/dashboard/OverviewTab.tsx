'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Truck, ArrowRight, Clock, Gem, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

export default function OverviewTab({ profile }: { profile: any }) {
  const supabase = createClient()
  const [stats, setStats] = useState({ totalValue: 0, itemCount: 0 })
  const [activeOrder, setActiveOrder] = useState<any>(null)
  const [recentPurchases, setRecentPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOverviewData() {
      if (!profile?.id) return

      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', profile.id)
          .neq('status', 'cancelled')
          .order('created_at', { ascending: false })

        if (error) throw error

        if (orders) {
          const deliveredOrders = orders.filter(o => o.status === 'delivered')
          const total = deliveredOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0)
          
          setStats({
            totalValue: total,
            itemCount: deliveredOrders.length
          })

          const inTransit = orders.find(o => ['confirmed', 'dispatched', 'shipped'].includes(o.status))
          setActiveOrder(inTransit)

          setRecentPurchases(orders.slice(0, 3))
        }
      } catch (err) {
        console.error("Data loading error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverviewData()
  }, [profile?.id, supabase])

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 shadow-sm gap-4">
      <Loader2 className="text-gold animate-spin" size={24} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">Loading your data...</p>
    </div>
  )

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* I. MAIN STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* VALUE CARD */}
        <div className="lg:col-span-2 p-8 md:p-12 bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-gold" size={14} />
                <p className="text-[10px] font-bold text-gold uppercase tracking-[0.2em]">Total Value</p>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-black font-serif italic tracking-tight break-words">
                ${stats.totalValue.toLocaleString()}<span className="text-xl md:text-2xl text-gray-200 not-italic font-sans">.00</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-gray-50">
               <StatItem label="Items Owned" value={`${stats.itemCount} Items`} />
               <StatItem label="Security" value="Active" />
               <div className="hidden md:block">
                  <StatItem label="Member Since" value={new Date(profile?.created_at).getFullYear().toString()} />
               </div>
            </div>
          </div>
        </div>

        {/* ACTIVE ORDER CARD (BLACK SIDE) */}
        <div className="p-8 bg-black rounded-3xl flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[320px]">
            <div className="absolute inset-0 bg-gold/[0.04] pointer-events-none" />
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                 <Truck size={16} className="text-gold" />
                 <span className="text-[10px] font-bold uppercase tracking-widest !text-gold">
                   {activeOrder ? 'Order on the way' : 'Status: Safe'}
                 </span>
              </div>
              
              {activeOrder ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-bold font-serif italic leading-tight !text-white">
                    Order <span className="text-gold font-sans font-bold not-italic uppercase tracking-tighter">{activeOrder.tracking_number || activeOrder.id.slice(0,8)}</span> is coming.
                  </h3>
                  <p className="text-[9px] !text-white/70 uppercase font-bold tracking-widest">
                    Worldwide Shipping
                  </p>
                </div>
              ) : (
                <h3 className="text-xl font-bold font-serif italic leading-tight !text-gray-400">
                  Everything is safe. Ready for your next <span className="!text-white">purchase?</span>
                </h3>
              )}
            </div>

            {activeOrder && (
              <button className="relative z-10 flex items-center justify-between w-full p-4 bg-white/10 border border-white/5 rounded-xl group hover:bg-gold hover:text-black transition-all duration-500">
                <span className="text-[10px] font-bold uppercase tracking-widest !text-white group-hover:!text-black">Track Order</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform !text-white group-hover:!text-black" />
              </button>
            )}
        </div>
      </div>

      {/* II. HISTORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-8">
          <div className="flex justify-between items-center border-b border-gray-50 pb-6">
            <h4 className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">Recent Activity</h4>
            <Clock size={14} className="text-gold" />
          </div>
          
          <div className="space-y-6">
            {recentPurchases.length > 0 ? recentPurchases.map((order) => (
              <RecentRow 
                key={order.id}
                name={order.items?.[0]?.name || 'Item'} 
                date={new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                price={`$${(Number(order.total_price) || 0).toLocaleString()}`} 
              />
            )) : (
              <p className="text-[10px] font-bold text-gray-300 uppercase text-center py-6 tracking-widest">No recent orders</p>
            )}
          </div>
        </div>

        <div className="p-8 bg-gray-50 rounded-3xl flex flex-col justify-center items-center text-center space-y-6 border border-gray-100 group">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-gold border border-gold/5 group-hover:scale-110 transition-transform duration-700">
            <Gem size={28} strokeWidth={1.5} />
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-black uppercase tracking-widest">Verified Quality</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto font-bold uppercase tracking-tighter">
              Every item is inspected and verified by our experts before it is added to your account.
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
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{date}</p>
        </div>
      </div>
      <p className="text-[11px] font-bold text-black font-sans shrink-0">{price}</p>
    </div>
  )
}