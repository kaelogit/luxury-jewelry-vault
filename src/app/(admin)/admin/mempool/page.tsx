'use client'

import React, { useState, useEffect } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, Clock, Globe, Shield, Radio, Search, Wallet, Landmark, Save, Copy, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function MempoolMonitor() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [ethPrice, setEthPrice] = useState<number | null>(null)
  const [hashQuery, setHashQuery] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  // GATEWAY STATE (This should be saved to a 'settings' or 'gateways' table in Supabase)
  const [gateways, setGateways] = useState({
    btc_address: "bc1qxy2kgdypjrsqz744387nw63699v5298as0385",
    eth_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    usdt_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    bank_details: "Lume Vault Ltd | JP Morgan Chase | Acc: 99281772 | Swift: CHASEUS33"
  })

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
        const data = await res.json()
        setBtcPrice(data.bitcoin.usd)
        setEthPrice(data.ethereum.usd)
      } catch (e) { console.error("Price Feed Disrupted.") }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) 
    return () => clearInterval(interval)
  }, [])

  const handleGatewayUpdate = async () => {
    setIsUpdating(true)
    // Logic to save 'gateways' to Supabase 'vault_settings' table
    setTimeout(() => setIsUpdating(false), 1500)
  }

  return (
    <div className="space-y-10 pb-20">
      
      {/* 1. LIQUIDITY TICKER */}
      <header className="flex flex-wrap gap-6 items-center border-b border-ivory-300 pb-10">
        <PriceStat label="Bitcoin" price={btcPrice} symbol="BTC" color="text-[#F7931A]" />
        <PriceStat label="Ethereum" price={ethPrice} symbol="ETH" color="text-[#627EEA]" />
        
        <div className="ml-auto flex items-center gap-4 px-6 py-3 bg-white border border-ivory-300 rounded-xl shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="label-caps !text-obsidian-900">Node Status: Synchronized</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. TRANSACTION MONITOR (LEFT) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex justify-between items-center">
             <h3 className="label-caps text-obsidian-900 flex items-center gap-3">
               <Activity size={16} className="text-gold" /> Inbound Asset Settlements
             </h3>
             {/* HASH LOOKUP TOOL */}
             <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-obsidian-300 group-focus-within:text-gold transition-colors" size={14} />
                <input 
                    value={hashQuery}
                    onChange={(e) => setHashQuery(e.target.value)}
                    placeholder="Verify Tx Hash..." 
                    className="w-full pl-10 pr-4 py-2 bg-white border border-ivory-300 rounded-lg text-[10px] uppercase font-bold outline-none focus:border-gold transition-all"
                />
             </div>
          </div>
          
          <div className="bg-white border border-ivory-300 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-ivory-50 border-b border-ivory-200">
                <tr className="label-caps !text-obsidian-400">
                  <th className="p-6">Age</th>
                  <th className="p-6">Value</th>
                  <th className="p-6">Asset</th>
                  <th className="p-6">Phase</th>
                  <th className="p-6 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-100">
                <MempoolRow time="2m" value="$52,000" crypto="0.82 BTC" status="Confirming" color="text-gold" />
                <MempoolRow time="14m" value="$12,500" crypto="4.12 ETH" status="Finalizing" color="text-obsidian-900" />
                <MempoolRow time="1h" value="$8,200" crypto="0.12 BTC" status="Secured" color="text-emerald-600" />
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. GATEWAY CONFIGURATION (RIGHT) */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white p-8 border border-ivory-300 rounded-xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-ivory-100 pb-4">
                <Wallet className="text-gold" size={18} />
                <h3 className="label-caps text-obsidian-900">Asset Gateways</h3>
            </div>

            <div className="space-y-4">
                <GatewayInput label="BTC Receipt Node" value={gateways.btc_address} onChange={(v) => setGateways({...gateways, btc_address: v})} />
                <GatewayInput label="ETH Receipt Node" value={gateways.eth_address} onChange={(v) => setGateways({...gateways, eth_address: v})} />
                <GatewayInput label="USDT (TRC-20)" value={gateways.usdt_address} onChange={(v) => setGateways({...gateways, usdt_address: v})} />
                
                <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400 flex items-center gap-2">
                        <Landmark size={12} className="text-gold" /> Bank Wire Instructions
                    </label>
                    <textarea 
                        value={gateways.bank_details}
                        onChange={(e) => setGateways({...gateways, bank_details: e.target.value})}
                        className="w-full h-24 bg-ivory-50 border border-ivory-200 rounded-lg p-3 text-[10px] font-bold text-obsidian-900 outline-none focus:border-gold"
                    />
                </div>
            </div>

            <button 
                onClick={handleGatewayUpdate}
                disabled={isUpdating}
                className="w-full py-4 bg-obsidian-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <><Save size={14} /> Commit Changes</>}
            </button>
          </section>

          <section className="p-6 bg-gold/5 border border-gold/20 rounded-xl space-y-3">
             <div className="flex items-center gap-2 text-gold">
                <Shield size={16} />
                <p className="label-caps !text-gold">Security Policy</p>
             </div>
             <p className="text-[10px] text-obsidian-600 leading-relaxed font-medium uppercase tracking-tight">
                Updating addresses instantly affects the checkout flow. Ensure new nodes are tested for inbound connectivity before committing.
             </p>
          </section>
        </div>

      </div>
    </div>
  )
}

/** * UI COMPONENTS 
 */
function PriceStat({ label, price, symbol, color }: any) {
  return (
    <div className="bg-white border border-ivory-300 p-6 rounded-xl min-w-[200px] shadow-sm group">
      <p className="text-[9px] uppercase text-obsidian-400 font-bold tracking-widest mb-1">{label} Spot</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-medium text-obsidian-900 font-serif italic">
          ${price ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '---'}
        </span>
        <span className={`text-[9px] font-bold uppercase ${color}`}>{symbol}</span>
      </div>
    </div>
  )
}

function GatewayInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-widest text-obsidian-400 ml-1">{label}</label>
            <div className="relative">
                <input 
                    type="text" value={value} onChange={(e) => onChange(e.target.value)} 
                    className="w-full bg-ivory-50 border border-ivory-200 rounded-lg pl-3 pr-8 py-2 text-[10px] font-mono font-bold text-obsidian-900 outline-none focus:border-gold"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-obsidian-300 hover:text-gold transition-colors">
                    <Copy size={12} />
                </button>
            </div>
        </div>
    )
}

function MempoolRow({ time, value, crypto, status, color }: any) {
  return (
    <tr className="hover:bg-ivory-50/50 transition-all cursor-pointer">
      <td className="p-6 text-obsidian-400 font-mono text-[10px] font-bold">{time}</td>
      <td className="p-6 text-sm font-bold text-obsidian-900">{value}</td>
      <td className="p-6 text-obsidian-600 font-mono text-[10px]">{crypto}</td>
      <td className={`p-6 text-[10px] font-bold uppercase tracking-widest ${color}`}>
        <span className="flex items-center gap-2">
          <Clock size={12} /> {status}
        </span>
      </td>
      <td className="p-6 text-right">
        <button className="w-8 h-8 rounded bg-ivory-100 flex items-center justify-center text-obsidian-400 hover:bg-gold hover:text-white transition-all">
          <ArrowUpRight size={14} />
        </button>
      </td>
    </tr>
  )
}