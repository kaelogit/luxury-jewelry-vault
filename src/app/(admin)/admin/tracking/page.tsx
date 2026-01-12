'use client'

import React, { useState, useEffect } from 'react'
import { 
  Truck, ShieldCheck, Search, Loader2, 
  CheckCircle2, ChevronRight, MapPin
} from 'lucide-react'
import { createClient } from '@/lib/supabase'

// LOGISTICS JOURNEY: Clear, standard milestones
const LOGISTICS_STEPS = [
  "Order Confirmed",
  "Quality Inspection & Appraisal",
  "Secure Packaging Completed",
  "Dispatched to Private Courier",
  "Arrived at Transit Hub",
  "Customs Clearance in Progress",
  "Arrived at Local Vault",
  "Out for Delivery",
  "Delivered & Signed"
]

export default function AdminTrackingTerminal() {
  const supabase = createClient() // FIX: Initialize once at the top
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newLocation, setNewLocation] = useState('')
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
    
    // Logic: Map milestones to standard order status
    let nextStatus = 'confirmed'
    if (milestone.includes('Dispatched')) nextStatus = 'shipped'
    if (milestone.includes('Delivered')) nextStatus = 'delivered'

    await supabase.from('orders').update({ 
      status: nextStatus,
      updated_at: new Date().toISOString() 
    }).eq('id', selectedOrder.id)

    await supabase.from('delivery_logs').insert({
      order_id: selectedOrder.id,
      milestone: milestone,
      location: newLocation || 'Headquarters'
    })

    setNewLocation('')
    fetchLogs(selectedOrder.id)
    fetchLogistics()
  }

  const filteredDeliveries = deliveries.filter(o => 
    o.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-gold" size={32} />
    </div>
  )

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header className="border-b border-gray-100 pb-8">
        <h2 className="text-3xl font-bold text-black uppercase tracking-tight">
          Shipment <span className="text-gold font-serif italic lowercase">Tracking</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Logistics Management Terminal</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SIDEBAR: Order Manifest */}
        <div className={`lg:col-span-4 space-y-6 ${selectedOrder ? 'hidden lg:block' : 'block'}`}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
            <input 
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-4 pl-12 pr-4 text-xs font-bold uppercase outline-none focus:border-gold transition-all"
              placeholder="Search Orders..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            {filteredDeliveries.map(order => (
              <button 
                key={order.id} 
                onClick={() => setSelectedOrder(order)}
                className={`w-full text-left p-6 rounded-2xl border transition-all ${
                  selectedOrder?.id === order.id 
                  ? 'border-black bg-black text-white shadow-xl' 
                  : 'border-gray-100 bg-white hover:border-gold'
                }`}
              >
                <p className={`text-[9px] font-mono mb-1 ${selectedOrder?.id === order.id ? 'text-gold' : 'text-gray-400'}`}>
                  {order.tracking_number}
                </p>
                <h4 className="font-bold text-sm uppercase">{order.client_name}</h4>
                <div className="flex justify-between items-center mt-4">
                  <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${
                    selectedOrder?.id === order.id ? 'bg-gold text-black' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {order.status}
                  </span>
                  <ChevronRight size={14} className={selectedOrder?.id === order.id ? 'text-gold' : 'text-gray-200'} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN TERMINAL: Update Interface */}
        <div className={`lg:col-span-8 ${!selectedOrder ? 'hidden lg:flex' : 'block'}`}>
          {selectedOrder ? (
            <div className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-10 space-y-10 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-50 pb-8">
                <button onClick={() => setSelectedOrder(null)} className="lg:hidden text-[10px] font-bold text-gold uppercase border border-gold/20 px-4 py-2 rounded-lg">Back to List</button>
                <div>
                  <p className="text-[10px] font-bold text-gold uppercase tracking-widest">Active Shipment</p>
                  <h3 className="text-xl font-bold uppercase">{selectedOrder.tracking_number}</h3>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                   <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                   <span className="text-[10px] font-bold uppercase text-black">{selectedOrder.status}</span>
                </div>
              </div>

              {/* ACTION PORTAL */}
              <div className="bg-gray-900 p-6 md:p-8 rounded-[1.5rem] space-y-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-gold" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white">Update Milestone</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select 
                    className="bg-black border border-white/10 p-4 rounded-xl text-[10px] font-bold text-white uppercase cursor-pointer outline-none focus:border-gold transition-all"
                    onChange={(e) => updateLogistics(e.target.value)}
                    value=""
                  >
                    <option value="">Select Milestone...</option>
                    {LOGISTICS_STEPS.map(step => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                      className="w-full bg-black border border-white/10 p-4 pl-12 rounded-xl text-[10px] font-bold text-white uppercase outline-none focus:border-gold transition-all"
                      placeholder="Current Location"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* ACTIVITY LOG */}
              <div className="space-y-8">
                <h5 className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">Activity Log</h5>
                <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                  {logs.map((log, i) => (
                    <div key={log.id} className="flex gap-6 items-start relative">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border shadow-sm ${
                        i === 0 ? 'bg-black text-gold border-gold' : 'bg-white text-gray-300 border-gray-100'
                      }`}>
                        {i === 0 ? <Truck size={14} /> : <CheckCircle2 size={12} />}
                      </div>
                      <div className="space-y-1">
                        <p className={`text-[11px] font-bold uppercase tracking-tight ${i === 0 ? 'text-black' : 'text-gray-400'}`}>
                          {log.milestone}
                        </p>
                        <p className="text-[9px] text-gray-400 uppercase font-medium">
                          {log.location} • {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-gray-100 rounded-[2.5rem] bg-gray-50/30">
              <div className="text-center space-y-2">
                <Search size={32} className="mx-auto text-gray-200" />
                <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-300">Select an entry to manage</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}