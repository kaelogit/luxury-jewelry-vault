'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ALIGNED WITH MASTER SQL REGISTRY
interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    category: string
    gold_purity?: string // Standardized key
    gia_report?: string  // Standardized key
    image: string        // Standardized key
    secondary_image?: string // Standardized key
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block w-full selection:bg-gold selection:text-white">
      <div className="space-y-5">
        
        {/* IMAGE CONTAINER: THE VAULT PRESENTATION */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-white border border-ivory-300 rounded-2xl shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:border-gold/20">
          
          {/* PRIMARY ARTIFACT IMAGE */}
          <Image
            src={product.image || 'https://via.placeholder.com/800x1000'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />

          {/* SECONDARY VIEW (Hover Handshake) */}
          {product.secondary_image && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 z-10"
            >
              <Image
                src={product.secondary_image}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
              />
            </motion.div>
          )}

          {/* QUALITY ATTESTATION BADGE */}
          {(product.gold_purity || product.gia_report) && (
            <div className="absolute top-5 left-5 z-20">
              <span className="bg-white/80 backdrop-blur-md px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-gold border border-gold/10 rounded-full shadow-xl italic">
                {product.gold_purity || "GIA Certified"}
              </span>
            </div>
          )}
          
          {/* SECURE OVERLAY */}
          <div className="absolute inset-0 bg-obsidian-900/0 group-hover:bg-obsidian-900/5 transition-colors duration-700 z-0" />
        </div>

        {/* TEXT CONTENT: INSTITUTIONAL LABELING */}
        <div className="space-y-2 px-1 transition-transform duration-500 group-hover:translate-x-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-[12px] font-medium font-serif italic tracking-tight text-obsidian-900 leading-tight">
              {product.name}
            </h3>
            <p className="text-[11px] font-bold text-obsidian-900 tracking-tighter">
              ${Number(product.price).toLocaleString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-gold rounded-full opacity-50" />
            <p className="text-[9px] text-obsidian-400 uppercase tracking-[0.3em] font-black italic">
              {product.category}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}