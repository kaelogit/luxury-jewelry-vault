'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckCircle2, Wallet, Landmark, Save, Loader2, 
  Bitcoin, Coins, Edit2, History, ShieldCheck, 
  Smartphone, DollarSign
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'

export default function PaymentSettings() {
  const supabase = createClient()
  
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [recentPayments, setRecentPayments] = useState<any[]>([])

  // STATE: Strictly mapped to the standard database columns
  const [gateways, setGateways] = useState({
    btc_address: "",
    eth_address: "",
    usdt_trc20_address: "",
    paypal_email: "",
    apple_pay_id: "",
    cashapp_tag: "",
    bank_name: "",
    account_name: "",
    account_number: "",
    routing_number: "",
    swift_code: "",
    bank_address: ""
  })

  useEffect(() => {
    fetchInitialData()
    const interval = setInterval(fetchPrices, 60000) 
    return () => clearInterval(interval)
  }, [])

  async function fetchInitialData() {
    setLoading(true)
    await Promise.all([fetchSettings(), fetchPrices(), fetchHistory()])
    setLoading(false)
  }

  async function fetchPrices() {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
      const data = await res.json()
      setBtcPrice(data.bitcoin.usd)
      setEthPrice(data.ethereum.usd)
    } catch (e) { console.error("Market feed offline") }
  }

  async function fetchSettings() {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) {
      console.error("Fetch Error:", error.message)
      return
    }

    if (data) {
      setGateways({
        btc_address: data.btc_address || "",
        eth_address: data.eth_address || "",
        usdt_trc20_address: data.usdt_trc20_address || "",
        paypal_email: data.paypal_email || "",
        apple_pay_id: data.apple_pay_id || "",
        cashapp_tag: data.cashapp_tag || "",
        bank_name: data.bank_name || "",
        account_name: data.account_name || "",
        account_number: data.account_number || "",
        routing_number: data.routing_number || "",
        swift_code: data.swift_code || "",
        bank_address: data.bank_address || ""
      })
    }
  }

  async function fetchHistory() {
    const { data } = await supabase
      .from('orders')
      .select('id, client_name, total_price, status, created_at, payment_method')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (data) setRecentPayments(data)
  }

  const handleSaveSettings = async () => {
    setIsUpdating(true)
    
    const { error } = await supabase
      .from('store_settings')
      .update({ 
        ...gateways,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (error) {
      alert("Save Failed: " + error.message)
    } else {
      setSaveSuccess(true)
      setIsEditing(false)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
    setIsUpdating(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="animate-spin text-gold" size={32} />
    </div>
  )

  return (
    <div className="space-y-10 pb-20 font-sans max-w-7xl mx-auto px-6 pt-6">
      
      {/* 1. HEADER */}
      <header className="flex flex-wrap gap-6 items-center border-b border-gray-100 pb-10 justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-black tracking-tight uppercase">
            Payments
          </h2>
          <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            Manage gateways and banking details
          </p>
        </div>
        <div className="flex gap-4">
          <PriceStat label="Bitcoin" price={btcPrice} icon={<Bitcoin size={14} className="text-[#F7931A]"/>} />
          <PriceStat label="Ethereum" price={ethPrice} icon={<Coins size={14} className="text-[#627EEA]"/>} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. CONFIGURATION COLUMN */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* DIGITAL PAYMENTS */}
          <section className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-8">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <div className="flex items-center gap-3">
                <Smartphone className="text-gold" size={18} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Digital Payments</h3>
              </div>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[10px] font-bold text-gold uppercase hover:underline">
                  <Edit2 size={12}/> Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="PayPal Email" value={gateways.paypal_email} disabled={!isEditing} onChange={(v) => setGateways({...gateways, paypal_email: v})} />
                <Input label="Apple Pay Merchant ID" value={gateways.apple_pay_id} disabled={!isEditing} onChange={(v) => setGateways({...gateways, apple_pay_id: v})} />
                <div className="md:col-span-2">
                   <Input label="CashApp Tag ($)" value={gateways.cashapp_tag} disabled={!isEditing} onChange={(v) => setGateways({...gateways, cashapp_tag: v})} />
                </div>
            </div>
          </section>

          {/* CRYPTO WALLETS */}
          <section className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Wallet className="text-gold" size={18} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Crypto Addresses</h3>
            </div>
            <div className="space-y-6">
                <Input label="Bitcoin (BTC)" value={gateways.btc_address} disabled={!isEditing} onChange={(v) => setGateways({...gateways, btc_address: v})} isMono />
                <Input label="Ethereum (ETH)" value={gateways.eth_address} disabled={!isEditing} onChange={(v) => setGateways({...gateways, eth_address: v})} isMono />
                <Input label="USDT (TRC-20)" value={gateways.usdt_trc20_address} disabled={!isEditing} onChange={(v) => setGateways({...gateways, usdt_trc20_address: v})} isMono />
            </div>
          </section>

          {/* BANKING DETAILS */}
          <section className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Landmark className="text-gold" size={18} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Bank Account</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Bank Name" value={gateways.bank_name} disabled={!isEditing} onChange={(v) => setGateways({...gateways, bank_name: v})} />
                <Input label="Account Name" value={gateways.account_name} disabled={!isEditing} onChange={(v) => setGateways({...gateways, account_name: v})} />
                <Input label="Account Number" value={gateways.account_number} disabled={!isEditing} onChange={(v) => setGateways({...gateways, account_number: v})} />
                <Input label="Routing Number" value={gateways.routing_number} disabled={!isEditing} onChange={(v) => setGateways({...gateways, routing_number: v})} />
                <Input label="SWIFT Code" value={gateways.swift_code} disabled={!isEditing} onChange={(v) => setGateways({...gateways, swift_code: v})} />
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Bank Address</label>
                  <textarea 
                    disabled={!isEditing}
                    value={gateways.bank_address || ""}
                    onChange={(e) => setGateways({...gateways, bank_address: e.target.value})}
                    className="w-full h-20 bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold text-black outline-none focus:border-gold disabled:opacity-50 transition-all resize-none"
                  />
                </div>
            </div>
          </section>

          {/* RECENT ACTIVITY */}
          <section className="bg-white p-8 border border-gray-100 rounded-3xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <History className="text-gold" size={18} />
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-black">Recent Transactions</h3>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {recentPayments.map((pay) => (
                  <tr key={pay.id}>
                    <td className="py-4">
                      <p className="text-xs font-bold text-black uppercase">{pay.client_name}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{pay.payment_method}</p>
                    </td>
                    <td className="py-4 text-xs font-bold text-black font-sans text-right">${pay.total_price?.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className="text-[8px] font-bold px-2 py-0.5 rounded-full border border-gold/20 text-gold bg-gold/5 uppercase">{pay.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* 3. SIDEBAR CONTROLS */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className="bg-black text-white p-10 rounded-3xl shadow-2xl space-y-8">
              <div className="space-y-2">
                <h4 className="text-2xl font-bold font-serif italic text-gold">Settings</h4>
                <p className="text-xs text-gray-400 leading-relaxed">Update your payment details. Changes reflect immediately on checkout.</p>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <button onClick={handleSaveSettings} disabled={isUpdating} className="w-full py-5 bg-gold text-black rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
                    {isUpdating ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16} /> Save Changes</>}
                  </button>
                  <button onClick={() => setIsEditing(false)} className="w-full py-5 border border-white/20 rounded-xl text-[11px] font-bold uppercase text-white hover:bg-white/5 transition-all">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full py-5 bg-white/10 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10 flex items-center justify-center gap-2">
                  <Edit2 size={14}/> Edit Settings
                </button>
              )}

              <AnimatePresence>
                {saveSuccess && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-green-400 bg-green-400/10 p-4 rounded-xl">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Saved Successfully</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gray-400">Connection</span>
                <span className="text-green-500 flex items-center gap-2"><ShieldCheck size={12}/> Secure</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function PriceStat({ label, price, icon }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl min-w-[150px] shadow-sm">
      <p className="text-[9px] uppercase text-gray-400 font-bold tracking-widest mb-1 flex items-center gap-2">{icon} {label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-bold text-black font-sans">${price ? price.toLocaleString() : '---'}</span>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, disabled, isMono }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">{label}</label>
      <input 
        type="text" 
        value={value || ""} 
        disabled={disabled} 
        onChange={(e) => onChange(e.target.value)} 
        className={`w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-xs font-bold text-black outline-none focus:border-gold disabled:opacity-50 transition-all ${isMono ? 'font-mono' : ''}`}
      />
    </div>
  )
}