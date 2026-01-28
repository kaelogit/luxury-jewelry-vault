'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { 
  Users, 
  Package, 
  ShieldCheck,
  ChevronRight,
  Clock,
  Circle,
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase'

export default function AdminDashboard() {
  const supabase = createClient()
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalClients: 0,
    totalRevenue: 0,
    recentOrders: [] as any[],
    distribution: { watches: 0, diamonds: 0, bullion: 0 },
    loading: true
  })

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Fetch Product Distribution
        const { data: products } = await supabase
          .from('products')
          .select('category')

        const productCount = products?.length || 0
        const watchCount = products?.filter(p => p.category === 'Watches').length || 0
        const diamondCount = products?.filter(p => p.category === 'Diamonds').length || 0
        const bullionCount = products?.filter(p => p.category === 'Gold').length || 0

        // 2. Fetch Customer Count
        const { count: clientCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'client')

        // 3. Fetch Total Revenue (Sum of total_spent from all client profiles)
        const { data: revenueData } = await supabase
          .from('profiles')
          .select('total_spent')

        const totalRev = revenueData?.reduce((acc, curr) => acc + (Number(curr.total_spent) || 0), 0) || 0

        // 4. Fetch Recent Orders
        const { data: recentOrders } = await supabase
          .from('orders')
          .select('id, tracking_number, client_name, total_price, status, created_at')
          .order('created_at', { ascending: false })
          .limit(4)

        setStats({
          totalProducts: productCount,
          totalClients: clientCount || 0,
          totalRevenue: totalRev,
          recentOrders: recentOrders || [],
          distribution: {
            watches: productCount > 0 ? Math.round((watchCount / productCount) * 100) : 0,
            diamonds: productCount > 0 ? Math.round((diamondCount / productCount) * 100) : 0,
            bullion: productCount > 0 ? Math.round((bullionCount / productCount) * 100) : 0,
          },
          loading: false
        })
      } catch (error) {
        console.error("Dashboard Sync Error:", error)
        setStats(s => ({ ...s, loading: false }))
      }
    }

    fetchDashboardData()
  }, [supabase])

  if (stats.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Loading Management Console</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-20 font-sans px-4 md:px-0 pt-6">
      
      {/* 1. HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black uppercase">
            Boutique <span className="text-gold font-serif italic font-medium normal-case">Overview</span>
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
            Live Sales Performance & Inventory Analytics
          </p>
        </div>
        
        {/* QUICK ACTION: SUPPORT LINK */}
        <Link 
          href="/admin/concierge" 
          className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95"
        >
          <MessageSquare size={16} className="text-gold" />
          Client Support
        </Link>
      </header>

      {/* 2. CORE METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} />
        <StatCard label="Vault Inventory" value={stats.totalProducts.toString()} icon={<Package size={20} />} />
        <StatCard label="Private Clients" value={stats.totalClients.toString()} icon={<Users size={20} />} />
        <StatCard label="System Status" value="Secure" icon={<ShieldCheck size={20} className="text-green-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2rem] p-6 md:p-10 shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
            <div className="flex items-center gap-3">
              <Activity size={16} className="text-gold" />
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Latest Transactions</h3>
            </div>
            <Link href="/admin/orders" className="text-[10px] text-gold hover:underline uppercase font-bold tracking-widest">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order, idx) => (
                <OrderRow 
                  key={idx}
                  id={order.tracking_number || `ORD-${order.id?.slice(0,6).toUpperCase()}`} 
                  client={order.client_name} 
                  amount={`$${Number(order.total_price).toLocaleString()}`} 
                  time={new Date(order.created_at).toLocaleDateString()} 
                  status={order.status} 
                />
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <Clock className="mx-auto text-gray-100" size={40} />
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No recent transactions</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. INVENTORY BREAKDOWN */}
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-10 space-y-10 shadow-sm">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-black flex items-center gap-3">
            <Circle size={8} className="fill-gold text-gold" /> Inventory Mix
          </h3>
          
          <div className="space-y-8">
            <ProgressBar label="Fine Watches" percentage={stats.distribution.watches} color="bg-black" />
            <ProgressBar label="Diamonds" percentage={stats.distribution.diamonds} color="bg-gold" />
            <ProgressBar label="Bullion" percentage={stats.distribution.bullion} color="bg-gray-300" />
          </div>

          <div className="pt-8 border-t border-gray-50">
              <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                  Regular inventory audits ensure accurate valuation across all boutique channels.
                </p>
                <Link href="/admin/inventory" className="text-[10px] text-gold font-bold uppercase flex items-center gap-2 hover:translate-x-1 transition-transform">
                    Manage Stock <ChevronRight size={12} />
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] hover:border-gold/30 transition-all shadow-sm group">
      <div className="bg-gray-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
        <div className="text-black group-hover:text-gold transition-colors">{icon}</div>
      </div>
      <p className="text-[10px] uppercase text-gray-400 font-bold tracking-[0.1em] mb-1">{label}</p>
      <h4 className="text-2xl md:text-3xl font-bold text-black font-sans tracking-tight">{value}</h4>
    </div>
  )
}

function OrderRow({ id, client, amount, time, status }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 gap-4 group hover:bg-gray-50/50 px-4 rounded-3xl transition-colors">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold text-gold">{id}</span>
          <h5 className="text-[11px] font-bold text-black uppercase tracking-wider">{client}</h5>
        </div>
        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-2 uppercase tracking-tight">
          <Clock size={10} /> {time}
        </p>
      </div>
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
         <p className="text-[12px] font-bold text-black font-sans">{amount}</p>
         <span className={`text-[8px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border shadow-sm ${
           status === 'delivered' ? 'border-green-100 text-green-600 bg-green-50' : 'border-gold/20 text-gold bg-gold/5'
         }`}>
           {status}
         </span>
      </div>
    </div>
  )
}

function ProgressBar({ label, percentage, color }: any) {
    return (
        <div className="space-y-3 font-sans">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>{label}</span>
                <span>{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} shadow-sm`} 
                />
            </div>
        </div>
    )
}