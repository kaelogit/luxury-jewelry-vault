'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronRight, FileText, MapPin, 
  ShieldCheck, Clock, Loader2, 
  ShoppingBag, CheckCircle2, Truck, Package,
  AlertCircle, ChevronDown
} from 'lucide-react'
import { createClient } from '@/lib/supabase'
import dynamic from 'next/dynamic'

// PREVENT HYDRATION ERROR: The PDF renderer must only load on the client side
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)
import SovereignCertificate from '@/components/ui/SovereignCertificate'

export default function OrdersTab() {
  // Use a stable supabase instance
  const supabase = useMemo(() => createClient(), [])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
          
          if (!error) setOrders(data || [])
        }
      } catch (err) {
        console.error("Orders Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [supabase])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-3xl border border-gray-100">
      <Loader2 className="text-gold animate-spin" size={32} strokeWidth={1.5} />
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Syncing Private Registry...</p>
    </div>
  )

  if (orders.length === 0) return (
    <div className="py-32 text-center space-y-6 bg-white rounded-3xl border border-gray-100">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
        <ShoppingBag size={28} className="text-gray-200" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-bold text-black uppercase tracking-tight">No Orders Found</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your acquisition history is currently empty.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 pb-10 font-sans">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

function OrderCard({ order }: { order: any }) {
  const supabase = useMemo(() => createClient(), [])
  const [expanded, setExpanded] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    if (expanded) {
      const fetchLogs = async () => {
        const { data } = await supabase
          .from('delivery_logs')
          .select('*')
          .eq('order_id', order.id)
          .order('created_at', { ascending: false })
        setLogs(data || [])
      }
      fetchLogs()
    }
  }, [expanded, order.id, supabase])

  const statusColors: any = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    confirmed: 'bg-blue-50 text-blue-600 border-blue-100',
    shipped: 'bg-gold/10 text-gold border-gold/20',
    delivered: 'bg-green-50 text-green-600 border-green-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100'
  }

  return (
    <motion.div 
      layout
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500"
    >
      {/* HEADER SECTION */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-6 md:p-8 cursor-pointer group select-none"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-5 items-center">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${order.status === 'delivered' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gold'}`}>
              {order.status === 'delivered' ? <CheckCircle2 size={24}/> : <Package size={24}/>}
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-mono font-bold text-gold uppercase tracking-tighter">
                {order.tracking_number || 'TRK-PENDING'}
              </p>
              <h4 className="text-sm font-bold text-black uppercase tracking-tight">
                {order.items?.length || 0} Assets Registered
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
            <div className="text-left md:text-right">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Valuation</p>
              <p className="text-lg font-bold text-black font-sans">${Number(order.total_price).toLocaleString()}</p>
            </div>
            
            <span className={`text-[9px] font-bold px-3 py-1 rounded-full uppercase border ${statusColors[order.status] || 'bg-gray-50'}`}>
              {order.status}
            </span>

            <div className={`w-8 h-8 rounded-xl border border-gray-100 flex items-center justify-center transition-all ${expanded ? 'bg-black text-white' : 'group-hover:border-gold'}`}>
              <ChevronDown className={`transition-transform duration-500 ${expanded ? 'rotate-180' : ''}`} size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* EXPANDABLE DETAILS */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50/40"
          >
            <div className="p-6 md:p-10 border-t border-gray-100 space-y-10">
              
              {/* ITEM GRID */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Acquired Assets</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        {item.image && <img src={item.image} className="w-12 h-16 object-cover rounded-xl border border-gray-50" alt="" />}
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-bold text-gold uppercase">{item.category}</p>
                          <h5 className="text-xs font-bold text-black uppercase">{item.name}</h5>
                          <p className="text-[10px] font-bold text-gray-400 mt-1">${Number(item.price).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* PDF DOWNLOAD TRIGGER */}
                      <PDFDownloadLink
                        document={<SovereignCertificate order={order} item={item} />}
                        fileName={`LUME-CERT-${item.name.replace(/\s+/g, '-')}.pdf`}
                        className="text-[9px] font-bold uppercase tracking-widest text-obsidian-900 border-b border-gold py-1 hover:text-gold transition-colors"
                      >
                        {({ loading }) => (loading ? 'Vetting...' : 'Certificate')}
                      </PDFDownloadLink>
                    </div>
                  ))}
                </div>
              </div>

              {/* SHIPMENT TRACKING */}
              <div className="space-y-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chain of Custody</p>
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-200">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={log.id} className="flex gap-6 relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border shadow-sm ${i === 0 ? 'bg-black text-gold border-gold' : 'bg-white text-gray-300 border-gray-100'}`}>
                        {i === 0 ? <Truck size={14}/> : <CheckCircle2 size={12}/>}
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-[11px] font-bold uppercase tracking-widest ${i === 0 ? 'text-black' : 'text-gray-400'}`}>
                          {log.milestone}
                        </h4>
                        <div className="flex gap-4 items-center">
                          <p className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1">
                            <MapPin size={10} className="text-gold" /> {log.location}
                          </p>
                          <p className="text-[9px] text-gray-300 font-medium uppercase">
                            {new Date(log.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="flex items-center gap-3 text-amber-600 bg-white p-5 rounded-2xl border border-amber-100 shadow-sm ml-2">
                       <AlertCircle size={14} />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Processing Secure Logistics - Updates will appear shortly.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-gold" size={20} />
                  <p className="text-[10px] font-bold text-black uppercase tracking-widest">Maison Verified • Fully Insured Delivery</p>
                </div>
                <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Official Lume Registry Record</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}