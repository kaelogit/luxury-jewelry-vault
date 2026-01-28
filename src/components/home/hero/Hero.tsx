'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const [activeImage, setActiveImage] = useState<string | null>(null)

  useEffect(() => {
    // Ensuring high-quality assets are loaded
    const heroAssets = ['/hero-image1.png', '/hero-image2.png']
    const selected = heroAssets[Math.floor(Math.random() * heroAssets.length)]
    setActiveImage(selected)
  }, [])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-obsidian-900">
      
      {/* I. BACKGROUND LAYER */}
      <AnimatePresence>
        {activeImage && (
          <motion.div 
            key={activeImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeImage})` }}
            />
            {/* GRADIENTS: Essential for text readability */}
            <div className="absolute inset-0 bg-black/40 z-1" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* II. CONTENT LAYER */}
      <div className="relative z-10 text-center px-6 max-w-5xl mt-[-5vh]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* HEADLINE */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-medium font-serif italic tracking-tighter leading-[0.9] mb-8 drop-shadow-2xl">
            <span className="text-white block">
              Fine Jewelry
            </span>
            <span className="text-gold not-italic block mt-2">
              & Timepieces.
            </span>
          </h1>

          <p className="text-ivory-100 text-sm md:text-lg max-w-lg mx-auto leading-relaxed font-light tracking-wide opacity-90">
            A curated collection of investment-grade diamonds, 
            hand-crafted 24K gold, and horological excellence.
          </p>

          {/* CTA */}
          <div className="pt-10 flex justify-center">
            <Link 
              href="/collection" 
              className="px-12 py-5 bg-white text-obsidian-900 text-[11px] font-bold uppercase tracking-[0.3em] rounded-xl hover:bg-gold hover:text-white transition-all duration-500 shadow-2xl active:scale-95"
            >
              View Collection
            </Link>
          </div>
        </motion.div>
      </div>

      {/* III. SCROLL INDICATOR */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
      >
        <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
          <motion.div 
            animate={{ y: [0, 64, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}