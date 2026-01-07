'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-ivory-200">
      
      {/* 1. BACKGROUND LAYER: High-End Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        {/* We use a subtle zoom animation to give the "Luxury Motion" feel */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="relative w-full h-full"
        >
          {/* PLACEHOLDER: Using a high-end luxury jewelry/watch visual */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592136184798-ca0d8e17643a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center" />
          
          {/* SOFT OVERLAY: Ensuring text readability */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/40" />
        </motion.div>
      </div>

      {/* 2. CONTENT LAYER: Clean & Institutional */}
      <div className="relative z-10 text-center px-6 max-w-5xl space-y-8">
        
        <div className="space-y-4">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="label-caps text-gold"
          >
            Established 2026
          </motion.p>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-9xl font-medium text-obsidian-900 font-serif italic tracking-tight leading-[0.9]"
          >
            Fine Jewelry <br/> 
            <span className="text-gold not-italic">&</span> Timepieces
          </motion.h1>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-obsidian-600 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Discover a curated collection of rare investment-grade diamonds, 
          hand-crafted gold jewelry, and horological masterpieces.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/collection" 
            className="w-full md:w-auto px-12 py-6 bg-obsidian-900 text-white text-xs font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-gold transition-all duration-300 shadow-xl"
          >
            Explore Collections
          </Link>
          
          <Link 
            href="/concierge" 
            className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-obsidian-900 hover:text-gold transition-colors"
          >
            Bespoke Service <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* 3. SCROLL INDICATOR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-obsidian-900 vertical-text">Scroll</span>
        <div className="w-[1px] h-12 bg-obsidian-900/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 48, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gold"
          />
        </div>
      </div>
    </section>
  )
}