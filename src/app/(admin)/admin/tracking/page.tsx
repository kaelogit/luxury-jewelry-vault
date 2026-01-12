'use client'

import React, { useState, useEffect } from 'react'
import { 
  Truck, ShieldCheck, MapPin, Package, 
  Clock, Navigation, Search, Loader2, 
  CheckCircle2, AlertCircle, Award
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'

// THE PERFECT LINE: Defined Milestones
const LOGISTICS_STEPS = [
  "Order Confirmed & Registry Updated",
  "Maison Authentication & Appraisal",
  "Bespoke Packaging Completed",
  "Handed to Secure Private Courier",
  "Arrived at International Transit Hub",
  "Cleared Customs & Security Protocol",
  "Arrived at Local Distribution Vault",
  "Out for Private Concierge Handover",
  "Handover Complete & Signed"
]

export default function AdminLogistics() {
  const supabase = createClient()
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newLocation, setNewLocation] = useState('')
  const [updating, setUpdating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLogistics()
    const channel = supabase.channel('logistics-sync').on('postgres_changes', { 
      event: '*', schema: 'public', table: 'orders' 
    }, () => fetchLogistics()).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (selectedOrder) fetchLogs(selectedOrder.id)
  }, [selectedOrder])

  async function fetchLogistics() {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setDeliveries(data)
    setLoading(false)
  }

  async function fetchLogs(orderId: string) {
    const { data } = await supabase
      .from('delivery_logs')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })
    if (data) setLogs(data)
  }

  const updateLogistics = async (milestone: string) => {
    if (!selectedOrder || !milestone) return
    setUpdating(true)
    
    // Auto-update order status based on milestone
    let nextStatus = 'confirmed'
    if (milestone.includes('Handed to')) nextStatus = 'dispatched'
    if (milestone.includes('Handover Complete')) nextStatus = 'delivered'

    await supabase.from('orders').update({ status: nextStatus }).eq('id', selectedOrder.id)

    await supabase.from('delivery_logs').insert({
      order_id: selectedOrder.id,
      milestone: milestone,
      location: newLocation || 'Lume Vault HQ'
    })

    setNewLocation('')
    fetchLogs(selectedOrder.id)
    fetchLogistics()
    setUpdating(false)
  }

  const filteredDeliveries = deliveries.filter(o => 
    o.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gold" /></div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 font-sans">
      <header className="border-b border-gray-100 pb-10">
        <h2 className="text-4xl font-bold">Logistics <span className="text-gold font-serif italic">Command</span></h2>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Manage the journey from vault to client</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase"
              placeholder="Search Manifest..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            {filteredDeliveries.map(order => (
              <div 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`p-6 rounded-[1.5rem] border transition-all cursor-pointer ${selectedOrder?.id === order.id ? 'border-gold bg-white shadow-xl' : 'border-gray-100 bg-white opacity-60'}`}
              >
                <p className="text-[10px] font-mono text-gold mb-1">{order.tracking_number}</p>
                <h4 className="font-bold text-sm uppercase">{order.client_name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN TERMINAL */}
        <div className="lg:col-span-8">
          {selectedOrder ? (
            <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-50 pb-8">
                <div>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Active Dispatch</p>
                  <h3 className="text-2xl font-bold uppercase">{selectedOrder.tracking_number}</h3>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-gray-400 uppercase font-bold">Current Phase</p>
                   <span className="text-xs font-bold uppercase text-black bg-gray-100 px-3 py-1 rounded-full">{selectedOrder.status}</span>
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="bg-black p-8 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-3 text-gold">
                  <ShieldCheck size={20} />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">Logistics Update Portal</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select 
                    className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-[10px] font-bold text-white uppercase outline-none focus:border-gold"
                    onChange={(e) => updateLogistics(e.target.value)}
                    value=""
                  >
                    <option value="">Choose Next Milestone...</option>
                    {LOGISTICS_STEPS.map(step => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                  <input 
                    className="bg-gray-900 border border-gray-800 p-4 rounded-xl text-[10px] font-bold text-white uppercase outline-none focus:border-gold"
                    placeholder="Current Geo-Location (e.g. Geneva, CH)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>
              </div>

              {/* RECENT LOGS */}
              <div className="space-y-6">
                <h5 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Live Activity Log</h5>
                <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                  {logs.map((log, i) => (
                    <div key={log.id} className="flex gap-6 items-start relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border ${i === 0 ? 'bg-black text-gold border-gold' : 'bg-white text-gray-300 border-gray-100'}`}>
                        {i === 0 ? <Truck size={14} /> : <CheckCircle2 size={14} />}
                      </div>
                      <div>
                        <p className={`text-[11px] font-bold uppercase ${i === 0 ? 'text-black' : 'text-gray-400'}`}>{log.milestone}</p>
                        <p className="text-[9px] text-gray-400 uppercase font-medium mt-1">{log.location} • {new Date(log.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[3rem] text-gray-300 text-[10px] uppercase font-bold tracking-[0.4em]">
              Select Registry Entry
            </div>
          )}
        </div>
      </div>
    </div>
  )
}