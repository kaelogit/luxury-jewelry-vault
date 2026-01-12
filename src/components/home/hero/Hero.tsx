'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    const heroAssets = ['/hero-image1.png', '/hero-image2.png']
    const selected = heroAssets[Math.floor(Math.random() * heroAssets.length)]
    setActiveImage(selected)
  }, [])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-obsidian-900">
      
      {/* I. BACKGROUND LAYER (z-0) */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeImage})` }}
            />
            
            {/* OVERLAYS: Darkening the image to make white text pop */}
            <div className="absolute inset-0 bg-obsidian-900/50 z-1" />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/40 via-transparent to-obsidian-900/80 z-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* II. CONTENT LAYER (z-10) */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-8"
        >
          {/* THE HEADER: Forced White with !important */}
          <h1 className="text-6xl md:text-9xl font-medium font-serif italic tracking-tighter leading-[0.85] mb-8 select-text">
            <span className="!text-white block" style={{ color: 'white' }}>
              Fine Jewelry
            </span>
            <span className="!text-gold not-italic block mt-2">
              & Timepieces.
            </span>
          </h1>

          <p className="!text-ivory-100 text-sm md:text-lg max-w-xl mx-auto leading-relaxed font-light tracking-wide italic opacity-90">
            A curated registry of investment-grade diamonds, 
            hand-crafted 24K gold, and horological excellence.
          </p>

          {/* CTA GROUP */}
          <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-8">
            <Link 
              href="/collection" 
              className="w-full md:w-auto px-14 py-6 bg-gold !text-obsidian-900 text-[11px] font-black uppercase tracking-[0.3em] rounded-sm hover:bg-white transition-all duration-500 shadow-2xl"
            >
              Shop the Collection
            </Link>
            
          </div>
        </motion.div>
      </div>

      {/* III. SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
      >
        <div className="w-[1px] h-16 bg-gold/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/3 bg-gold"
          />
        </div>
      </motion.div>
    </section>
  )
}