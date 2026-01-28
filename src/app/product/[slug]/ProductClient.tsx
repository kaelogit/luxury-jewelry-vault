'use client'

import React, { useState, useMemo } from 'react'
import { 
  ChevronRight, ShoppingBag, Truck, ShieldCheck, CheckCircle2, ChevronLeft, ArrowRight, Play 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelectionStore } from '@/store/useSelectionStore'
import { useUIStore } from '@/store/useUIStore'
import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import Image from 'next/image'
import SovereignReviews from '@/components/product/SovereignReviews' 

// SHIMMER LOADER
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
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

interface Product {
  id: string; name: string; price: number; images: string[]; category: 'Watches' | 'Diamonds' | 'Gold';
  sub_category?: string; description: string; slug: string; sku?: string;
  brand?: string; gold_purity?: string; diamond_clarity?: string;
  diamond_color?: string; diamond_cut?: string; shape?: string; 
  movement?: string; case_material?: string; has_box_and_papers?: boolean;
  weight_grams?: number; metal_color?: string; video_url?: string;
}

export default function ProductClient({ product, recommendations }: { product: Product, recommendations: any[] }) {
  const addItem = useSelectionStore((state) => state.addItem)
  const openDrawer = useUIStore((state) => state.openSelectionDrawer)
  
  const [activeTab, setActiveTab] = useState<'specs' | 'logistics'>('specs')
  const [currentImg, setCurrentImg] = useState(0)
  const [showVideo, setShowVideo] = useState(false) 

  const technicalSpecs = useMemo(() => [
    { label: 'Reference', value: product.sku || product.id.slice(0, 8).toUpperCase() },
    { label: 'Brand', value: product.brand },
    { label: 'Movement', value: product.movement },
    { label: 'Purity', value: product.gold_purity },
    { label: 'Clarity', value: product.diamond_clarity },
    { label: 'Color', value: product.diamond_color },
    { label: 'Weight', value: product.weight_grams ? `${product.weight_grams}g` : null },
    { label: 'Shape', value: product.shape },
    { label: 'Material', value: product.case_material },
    { label: 'Finish', value: product.metal_color },
  ].filter(spec => spec.value), [product]);

  const handleAcquisition = () => {
    addItem({
      id: product.id, name: product.name, price: product.price,
      image: product.images?.[0] || '', category: product.category,
      slug: product.slug, house: product.brand || 'Lume Vault'
    })
    openDrawer()
  }

  const hasVideo = !!product.video_url

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-32 pb-20 font-sans">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        
        {/* I. BREADCRUMBS */}
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link href="/collection" className="hover:text-black transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-black">{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24 items-start">
          
          {/* II. MEDIA GALLERY */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/5] bg-gray-50 border border-gray-100 rounded-sm overflow-hidden group">
              <AnimatePresence mode="wait">
                {!showVideo ? (
                  <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <Image 
                      src={product.images?.[currentImg] || ''} 
                      alt={product.name} 
                      fill 
                      priority 
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                      className="object-cover" 
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                ) : (
                  <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                    <video 
                      src={product.video_url} 
                      autoPlay loop muted playsInline 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* NAV BUTTONS */}
              {!showVideo && product.images?.length > 1 && (
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <MediaNavButton onClick={() => setCurrentImg(prev => (prev > 0 ? prev - 1 : product.images.length - 1))} icon={<ChevronLeft size={20} />} />
                  <MediaNavButton onClick={() => setCurrentImg(prev => (prev < product.images.length - 1 ? prev + 1 : 0))} icon={<ChevronRight size={20} />} />
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => { setCurrentImg(i); setShowVideo(false); }} 
                  className={`relative w-20 h-24 flex-shrink-0 rounded-sm overflow-hidden border transition-all ${currentImg === i && !showVideo ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" />
                </button>
              ))}
              {hasVideo && (
                <button onClick={() => setShowVideo(true)} className={`w-20 h-24 flex-shrink-0 bg-gray-100 flex flex-col items-center justify-center gap-1 rounded-sm border transition-all ${showVideo ? 'border-black opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                  <Play size={16} className="text-black" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Video</span>
                </button>
              )}
            </div>
          </div>

          {/* III. PRODUCT INFO */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-10">
            <header className="space-y-6 border-b border-gray-100 pb-10">
              <div className="flex items-center gap-4">
                <span className="bg-gray-100 px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-black">
                  {product.brand || product.category}
                </span>
                {product.has_box_and_papers && (
                  <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-gold" /> Certified
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif italic text-black leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-black font-sans">
                ${Number(product.price).toLocaleString()}
              </p>
            </header>

            <div className="space-y-8">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {product.description}
              </p>

              <div className="space-y-6">
                <button 
                  onClick={handleAcquisition} 
                  className="w-full py-5 bg-black text-white rounded-xl text-[11px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-gold hover:text-black transition-all shadow-xl active:scale-95"
                >
                  Add to Cart <ShoppingBag size={16} />
                </button>
                
                <div className="grid grid-cols-2 gap-4">
                  <TrustBadge icon={<Truck size={14} />} text="Free Shipping" />
                  <TrustBadge icon={<CheckCircle2 size={14} />} text="Authenticity Guarantee" />
                </div>
              </div>
            </div>

            {/* SPECS & DETAILS */}
            <div className="border-t border-gray-100 pt-8">
               <Accordion title="Specifications" isOpen={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>
                 <div className="grid grid-cols-2 gap-y-4 text-[10px] font-bold uppercase tracking-widest text-black pb-8 pt-4">
                   {technicalSpecs.map((spec, i) => (
                     <React.Fragment key={i}>
                       <p className="text-gray-400">{spec.label}</p>
                       <p className="text-right md:text-left">{spec.value}</p>
                     </React.Fragment>
                   ))}
                 </div>
               </Accordion>

               <Accordion title="Shipping & Returns" isOpen={activeTab === 'logistics'} onClick={() => setActiveTab('logistics')}>
                 <div className="space-y-4 pb-8 pt-4">
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      Complimentary insured shipping on all orders. We offer a 14-day return policy for items in original condition.
                    </p>
                    <Link href="/shipping" className="text-[10px] font-bold uppercase text-black hover:text-gold border-b border-gray-200 pb-1 inline-block">
                      Read Policy
                    </Link>
                 </div>
               </Accordion>
            </div>
          </div>
        </div>

        {/* IV. REVIEWS */}
        <SovereignReviews productId={product.id} category={product.category} />

        {/* V. RELATED ITEMS */}
        <section className="mt-32 pt-20 border-t border-gray-100">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl font-serif italic text-black">You May Also Like</h3>
            <Link href="/collection" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
               View All <ArrowRight size={14}/>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {recommendations.slice(0, 4).map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function MediaNavButton({ onClick, icon }: any) {
  return (
    <button onClick={onClick} className="pointer-events-auto p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100 text-black">
      {icon}
    </button>
  )
}

function TrustBadge({ icon, text }: any) {
  return (
    <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-gray-500 uppercase tracking-widest border border-gray-100 py-4 rounded-xl bg-gray-50">
      <div className="text-black">{icon}</div> {text}
    </div>
  )
}

function Accordion({ title, children, isOpen, onClick }: any) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={onClick} className="w-full flex justify-between items-center py-6 text-[11px] font-bold uppercase tracking-widest text-black hover:text-gold transition-colors">
        {title}
        <span className={`text-lg transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}