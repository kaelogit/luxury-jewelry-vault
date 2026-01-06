'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Activity, ShieldCheck, Globe, Fingerprint } from 'lucide-react'

export default function MempoolTicker() {
  const marketData = [
    { symbol: 'AU/USD', price: '2,042.50', label: 'GOLD' },
    { symbol: 'BTC/USD', price: '98,240.50', label: 'BTC' },
    { symbol: 'ETH/USD', price: '3,412.12', label: 'ETH' },
  ]

  const transactions = [
    "PROTOCOL LV-9928: HAND-DELIVERY VERIFIED (ZURICH HUB)",
    "PROTOCOL LV-1024: 1.25 BTC SETTLEMENT FINALIZED",
    "PROTOCOL LV-8821: LBMA QUALITY AUDIT CLEARED",
    "PROTOCOL LV-3301: ASSET SECURED IN COLD VAULT 01",
    "PROTOCOL LV-4402: ARMORED TRANSIT LOGISTICS ACTIVE",
  ]

  return (
    <div className="bg-white/80 backdrop-blur-2xl border-y border-ivory-300 h-14 overflow-hidden flex items-center selection:bg-gold selection:text-white">
      
      {/* I. THE PULSE: Fixed Institutional Label */}
      <div className="h-full px-10 bg-white z-20 border-r border-ivory-300 flex items-center gap-4 shadow-[15px_0_30px_rgba(0,0,0,0.02)]">
        <div className="relative flex items-center justify-center">
          <Activity size={14} className="text-gold" />
          <motion.div 
            animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute w-5 h-5 bg-gold rounded-full"
          />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-obsidian-900 italic">
          Sovereign <span className="text-gold">Pulse</span>
        </span>
      </div>

      {/* II. THE LEDGER: Scrolling Data Feed */}
      <div className="flex-1 flex items-center overflow-hidden">
        <motion.div 
          className="flex whitespace-nowrap gap-16 items-center"
          animate={{ x: [0, -2000] }}
          transition={{ 
            duration: 50, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              {transactions.map((tx, idx) => (
                <div key={`tx-${idx}`} className="flex items-center gap-10">
                  
                  {/* Transaction String */}
                  <div className="flex items-center gap-3">
                    <Fingerprint size={10} className="text-gold/40" />
                    <span className="text-[10px] font-mono text-obsidian-400 tracking-tight uppercase italic">
                      {tx}
                    </span>
                  </div>
                  
                  {/* Unified Financial Data */}
                  {marketData.map((coin) => (
                    <div key={coin.symbol} className="flex items-center gap-4 px-6 border-l border-ivory-300">
                      <span className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest">
                        {coin.symbol}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-obsidian-900 tracking-tighter italic">
                        ${coin.price}
                      </span>
                    </div>
                  ))}
                  
                  <ShieldCheck size={12} className="text-gold/30" />
                  <div className="w-1.5 h-1.5 bg-ivory-300 rounded-full" />
                </div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* III. STATUS END-CAP: Global Network */}
      <div className="hidden lg:flex h-full px-10 bg-white z-20 border-l border-ivory-300 items-center gap-4">
        <Globe size={14} className="text-gold" />
        <span className="text-[9px] font-black text-obsidian-400 uppercase tracking-[0.4em] italic">
          Nodes: <span className="text-obsidian-900">Synchronized</span>
        </span>
      </div>
    </div>
  )
}