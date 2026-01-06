'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Box, ChevronRight, FileText, MapPin, 
  ShieldCheck, Clock, ArrowUpRight, Loader2, 
  History, PackageCheck, Globe
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import CertificateDownload from '@/components/ui/CertificateDownload'

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
        setOrders(data || [])
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="text-gold animate-spin" size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-obsidian-300">Retrieving Ledger...</p>
    </div>
  )

  if (orders.length === 0) return (
    <div className="py-32 text-center space-y-8">
      <div className="w-20 h-20 bg-white border border-ivory-300 rounded-[2rem] flex items-center justify-center mx-auto opacity-40">
        <History size={32} className="text-obsidian-200" />
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-light text-obsidian-900 italic uppercase">Registry Empty.</h4>
        <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-widest italic">No acquisitions found in current node.</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 mb-10">
        <History className="text-gold" size={18} />
        <h3 className="text-[11px] font-black text-obsidian-900 uppercase tracking-[0.5em] italic">Settlement History</h3>
        <div className="h-[1px] flex-1 bg-ivory-300" />
      </div>

      <div className="grid grid-cols-1 gap-12">
        {orders.map((order, i) => (
          <OrderCard key={order.id} order={order} index={i} />
        ))}
      </div>
    </div>
  )
}

function OrderCard({ order, index }: { order: any, index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-ivory-300 rounded-[3.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group"
    >
      {/* HEADER: Settlement Summary */}
      <div className="p-10 md:p-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 border-b border-ivory-100">
        <div className="flex gap-8 items-center">
          <div className="w-16 h-16 bg-ivory-50 border border-ivory-200 rounded-2xl flex items-center justify-center text-gold shadow-inner">
            <PackageCheck size={24} />
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic leading-none">Acquisition Signature</p>
            <h4 className="text-2xl font-light text-obsidian-900 italic tracking-tighter uppercase">ID_{order.id.slice(0, 8)}</h4>
            <p className="text-[10px] font-mono text-obsidian-300 uppercase tracking-widest">SETTLED: {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
           <div className="text-right">
              <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-widest italic mb-1">Total Valuation</p>
              <p className="text-3xl font-light text-obsidian-900 italic tracking-tighter leading-none">${Number(order.total_valuation).toLocaleString()}</p>
           </div>
           <button 
            onClick={() => setExpanded(!expanded)}
            className={`w-14 h-14 rounded-full border border-ivory-300 flex items-center justify-center transition-all duration-500 ${expanded ? 'bg-gold border-gold text-white' : 'text-obsidian-300 hover:border-gold hover:text-gold'}`}
           >
             <ChevronRight className={`transition-transform duration-500 ${expanded ? 'rotate-90' : ''}`} size={20} />
           </button>
        </div>
      </div>

      {/* EXPANDABLE: Asset Specifics */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-10 md:p-14 bg-ivory-50/50 space-y-12">
              
              {/* ITEM LIST */}
              <div className="space-y-8">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white p-8 rounded-3xl border border-ivory-200 shadow-sm">
                    <div className="flex items-center gap-6">
                       <img src={item.image} className="w-20 h-20 object-cover rounded-2xl border border-ivory-200 grayscale hover:grayscale-0 transition-all duration-700" alt={item.title} />
                       <div className="space-y-2">
                          <p className="text-[9px] font-black text-gold uppercase tracking-widest italic">{item.asset_class}</p>
                          <h5 className="text-lg font-light text-obsidian-900 uppercase italic tracking-tighter">{item.title}</h5>
                          <p className="text-xs font-mono text-obsidian-400 italic">${Number(item.price).toLocaleString()}</p>
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       {/* THE SOVEREIGN CERTIFICATE DOWNLOAD */}
                       <CertificateDownload order={order} item={item} />
                       
                       <button className="flex items-center gap-3 px-6 py-4 bg-white border border-ivory-300 rounded-2xl text-[10px] font-black uppercase tracking-widest text-obsidian-300 hover:text-gold hover:border-gold transition-all">
                          <MapPin size={14} /> Tracking
                       </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* BLOCKCHAIN SETTLEMENT PROOF */}
              <div className="pt-8 border-t border-ivory-200 flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="space-y-2">
                    <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">Immutable Hash Registry</p>
                    <code className="text-[10px] text-obsidian-400 bg-white px-4 py-2 rounded-full border border-ivory-200 font-mono">
                      {order.tx_hash || '0x71C7656EC7AB88B098defB751B7401B5f6d8976F'}
                    </code>
                 </div>
                 <div className="flex items-center gap-3">
                    <ShieldCheck className="text-gold" size={16} />
                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Protocol Finalized</span>
                 </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}