'use client'

import React from 'react'
import { motion } from 'framer-motion'

// INSTITUTIONAL COMPONENTS
import Hero from '@/components/home/hero/Hero'
import VaultExplorer from '@/components/home/VaultExplorer'
import SecurityStandards from '@/components/home/SecurityStandards'
import MempoolTicker from '@/components/home/MempoolTicker'
import ConciergeCall from '@/components/home/ConciergeCall'
import HomeTracker from '@/components/home/HomeTracker'

export default function Home() {
  return (
    <main className="min-h-screen bg-ivory-100 overflow-x-hidden selection:bg-gold selection:text-white">
      
      {/* 1. THE 3D INGRESS (The Vault Entrance) */}
      <section className="relative h-screen">
        <Hero />
      </section>

      {/* 2. THE MARKET PULSE: Sovereign Ticker */}
      {/* Updated to Pearl/Gold sticky header */}
      <div className="sticky top-[70px] md:top-[80px] z-30 bg-white/70 backdrop-blur-2xl border-y border-ivory-300">
        <MempoolTicker />
      </div>

      {/* 3. THE ASSET REGISTRY: Vault Explorer */}
      {/* Using editorial spacing to highlight the ivory canvas */}
      <section className="relative z-10 py-24 md:py-48">
        <div className="max-w-[1700px] mx-auto">
          <VaultExplorer />
        </div>
      </section>

      {/* 4. THE AUDIT BRIDGE: Chain of Custody */}
      {/* Replaces the industrial 'Tracker' look with a sleek Audit Ingress */}
      <section className="bg-white py-24 md:py-48 border-y border-ivory-300 shadow-inner">
        <HomeTracker />
      </section>

      {/* 5. THE FOUNDATIONAL CHARTER: Security Standards */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="py-24 md:py-48 bg-ivory-100"
      >
        <SecurityStandards />
      </motion.section>

      {/* 6. THE PRIVATE DESK: Concierge Command */}
      {/* The final CTA before the footer */}
      <section className="pb-32 md:pb-64 bg-ivory-100">
        <ConciergeCall />
      </section>

      {/* DECORATIVE AMBIENCE: Subtle Gold Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-64 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full" />
      </div>

    </main>
  )
}