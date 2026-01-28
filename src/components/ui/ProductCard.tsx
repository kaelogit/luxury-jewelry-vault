'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

// SHIMMER PLACEHOLDER
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    category: string
    gold_purity?: string
    diamond_clarity?: string
    images?: string[]
    brand?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/800x1000'
  const hoverImage = product.images?.[1] || null

  return (
    <Link href={`/product/${product.slug}`} className="group block w-full">
      <div className="space-y-4">
        
        {/* I. IMAGE CONTAINER */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50 border border-gray-100 rounded-3xl shadow-sm transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1">
          
          {/* Main Image */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(400, 500))}`}
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          />

          {/* Hover Image */}
          {hoverImage && (
            <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
              <Image
                src={hoverImage}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          )}

          {/* Badge */}
          {(product.gold_purity || product.diamond_clarity || product.brand) && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/10 rounded-full shadow-sm">
                {product.brand || product.gold_purity || product.diamond_clarity}
              </span>
            </div>
          )}
        </div>

        {/* II. DETAILS */}
        <div className="space-y-1 px-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-xs font-bold uppercase tracking-tight text-obsidian-900 leading-relaxed truncate flex-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <p className="text-xs font-medium text-obsidian-900 font-sans">
              ${Number(product.price).toLocaleString()}
            </p>
          </div>
          
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
            {product.category}
          </p>
        </div>
      </div>
    </Link>
  )
}