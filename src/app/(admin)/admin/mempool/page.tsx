'use client'

import React, { useState, useEffect } from 'react'
import { Activity, ArrowUpRight, CheckCircle2, Clock, Zap, Globe, Shield, BarChart3, Radio } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MempoolMonitor() {
  const [btcPrice, setBtcPrice] = useState<number | null>(null)
  const [ethPrice, setEthPrice] = useState<number | null>(null)

  // 1. ORACLE FEED: Real-time Price Protocol
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd')
        const data = await res.json()
        setBtcPrice(data.bitcoin.usd)
        setEthPrice(data.ethereum.usd)
      } catch (e) { console.error("Sovereign Price Feed Disrupted.") }
    }
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) 
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-12 pb-10 selection:bg-gold selection:text-white">
      
      {/* HEADER: GLOBAL LIQUIDITY TICKER */}
      <header className="flex flex-wrap gap-8 items-center border-b border-ivory-300 pb-10">
        <PriceStat label="Bitcoin" price={btcPrice} symbol="BTC" color="text-[#F7931A]" />
        <PriceStat label="Ethereum" price={ethPrice} symbol="ETH" color="text-[#627EEA]" />
        
        <div className="ml-auto flex items-center gap-4 px-6 py-3 bg-gold/5 border border-gold/20 rounded-full shadow-inner">
          <Radio size={14} className="text-gold animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold italic">Lume Node: Online</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: LIVE SETTLEMENT INGRESS (The Ledger) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h3 className="text-[11px] uppercase tracking-[0.5em] text-obsidian-400 font-black flex items-center gap-3 italic">
                <Activity size={16} className="text-gold" /> Inbound Asset Settlement
              </h3>
            </div>
            <p className="text-[10px] text-obsidian-300 font-mono">Live Handshake Monitor</p>
          </div>
          
          <div className="bg-white border border-ivory-300 rounded-[3rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-ivory-300 bg-ivory-50 text-[10px] uppercase text-obsidian-400 tracking-[0.3em] italic">
                  <th className="p-8 font-black">Timestamp</th>
                  <th className="p-8 font-black">Fiat Valuation</th>
                  <th className="p-8 font-black">Cryptographic Amount</th>
                  <th className="p-8 font-black">Protocol Status</th>
                  <th className="p-8 font-black text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                <MempoolRow 
                  time="JUST NOW" 
                  value="$52,000.00" 
                  crypto="0.8241 BTC" 
                  status="IDENTIFYING..." 
                  statusColor="text-gold"
                />
                <MempoolRow 
                  time="4M AGO" 
                  value="$12,500.00" 
                  crypto="4.12 ETH" 
                  status="CONFIRMING (1/3)" 
                  statusColor="text-obsidian-900"
                />
                <MempoolRow 
                  time="18M AGO" 
                  value="$8,200.00" 
                  crypto="0.12 BTC" 
                  status="SECURED" 
                  statusColor="text-emerald-600"
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: SECURITY & NETWORK INFRASTRUCTURE */}
        <div className="space-y-10">
          <section className="bg-white p-10 border border-ivory-300 rounded-[3rem] space-y-10 shadow-sm">
            <h3 className="text-[11px] uppercase tracking-[0.5em] text-obsidian-400 font-black italic border-b border-ivory-200 pb-4">Network Integrity</h3>
            
            <div className="space-y-6">
              <NetworkMetric label="BTC Hashrate" value="642.1 EH/s" />
              <NetworkMetric label="ETH Gas Price" value="18 Gwei" />
              <NetworkMetric label="Vault Latency" value="24ms" />
            </div>
            
            <button className="w-full py-5 bg-obsidian-900 text-gold rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all shadow-xl active:scale-95">
              Rotate Cold Addresses
            </button>
          </section>

          <section className="bg-gold/5 p-10 border border-gold/20 rounded-[3rem] relative overflow-hidden group">
            <Shield className="absolute -right-8 -bottom-8 text-gold opacity-5 w-32 h-32 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-4 mb-6">
              <Zap className="text-gold" size={20} />
              <h3 className="text-[11px] uppercase tracking-[0.5em] text-gold font-black italic">Settlement Logic</h3>
            </div>
            <p className="text-[12px] text-gold/80 leading-relaxed italic font-medium">
              LUME VAULT operates via Direct-to-Custody protocols. Every transaction is matched against a unique XPub derivation to ensure zero-knowledge client privacy.
            </p>
          </section>
        </div>

      </div>
    </div>
  )
}

function PriceStat({ label, price, symbol, color }: any) {
  return (
    <div className="bg-white border border-ivory-300 p-8 rounded-[2rem] min-w-[240px] shadow-sm group hover:shadow-xl transition-all duration-500">
      <p className="text-[10px] uppercase text-obsidian-400 font-black tracking-[0.4em] mb-3 italic">{label} Spot</p>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-light text-obsidian-900 tracking-tighter italic">
          ${price ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '---'}
        </span>
        <span className={`text-[10px] font-black uppercase ${color} tracking-widest`}>{symbol}</span>
      </div>
    </div>
  )
}

function MempoolRow({ time, value, crypto, status, statusColor }: any) {
  return (
    <tr className="hover:bg-ivory-50 transition-all group cursor-pointer">
      <td className="p-8 text-obsidian-400 font-mono text-[10px] font-bold uppercase">{time}</td>
      <td className="p-8 text-lg font-light italic text-obsidian-900 tracking-tight">{value}</td>
      <td className="p-8 text-obsidian-600 font-mono text-xs font-medium tracking-tighter">{crypto}</td>
      <td className={`p-8 text-[10px] font-black tracking-widest ${statusColor} italic`}>
        <span className="flex items-center gap-3">
          <Clock size={12} className={status.includes('...') ? 'animate-pulse' : ''} /> {status}
        </span>
      </td>
      <td className="p-8 text-right">
        <button className="w-10 h-10 rounded-xl bg-ivory-100 flex items-center justify-center text-obsidian-400 hover:bg-gold hover:text-white transition-all shadow-inner">
          <ArrowUpRight size={16} />
        </button>
      </td>
    </tr>
  )
}

function NetworkMetric({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 group">
      <span className="text-[10px] text-obsidian-400 uppercase font-black tracking-widest italic group-hover:text-gold transition-colors">{label}</span>
      <span className="text-xs text-obsidian-900 font-mono font-bold border-b border-ivory-200 group-hover:border-gold transition-all">{value}</span>
    </div>
  )
}