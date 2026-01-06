'use client'

import React, { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Center } from '@react-three/drei'
import { GoldBar, DiamondAsset } from '../Scene'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Fingerprint } from 'lucide-react'

export default function Hero() {
  const [activeAsset, setActiveAsset] = useState<'gold' | 'diamond'>('gold')

  return (
    <div className="relative h-screen w-full bg-ivory-100 overflow-hidden selection:bg-gold selection:text-white">
      
      {/* 1. THE 3D OPTICAL LAYER */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 35 }}>
          {/* Pearl background color sync */}
          <color attach="background" args={['#FBFBF7']} />
          
          <ambientLight intensity={activeAsset === 'gold' ? 0.8 : 0.4} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} color="#ffffff" />
          <pointLight 
            position={[-10, -10, -10]} 
            color={activeAsset === 'gold' ? '#D4AF37' : '#ffffff'} 
            intensity={0.8}
          />
          
          <Suspense fallback={null}>
            <Center key={activeAsset} top>
               {activeAsset === 'gold' ? <GoldBar /> : <DiamondAsset />}
            </Center>
            
            {/* Using studio environment for realistic pearl/gold reflections */}
            <Environment preset="studio" />
            
            <ContactShadows 
              position={[0, -1.2, 0]} 
              opacity={0.15} 
              scale={10} 
              blur={3} 
              far={4} 
            />
          </Suspense>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.3}
            makeDefault 
          />
        </Canvas>
      </div>

      {/* 2. ATMOSPHERIC SCRIM: Subtle Gold Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-0 transition-opacity duration-1000 bg-radial-gradient from-transparent via-transparent to-gold/5 ${activeAsset === 'gold' ? 'opacity-100' : 'opacity-30'}`} />
      </div>

      {/* 3. EDITORIAL UI LAYER */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center pointer-events-none px-6">
        
        {/* Verification Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-4 px-6 py-2 bg-white/50 backdrop-blur-md border border-ivory-300 rounded-full shadow-sm"
        >
          <Fingerprint size={14} className="text-gold" />
          <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em] italic">Vault Registry v4.0</span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeAsset}
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="text-center space-y-8"
          >
            <h1 className="text-8xl md:text-[12rem] font-light tracking-tighter text-obsidian-900 italic leading-[0.8]">
              Lume <br/> <span className="text-obsidian-400">Vault.</span>
            </h1>
            
            <div className="flex flex-col items-center gap-4">
              <div className="h-[1px] w-24 bg-gold/30" />
              <p className="text-[11px] md:text-[13px] font-black tracking-[0.5em] text-obsidian-300 uppercase italic">
                {activeAsset === 'gold' ? 'Sovereign Bullion Reserve' : 'GIA Certified Investment Grade'}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 4. THE SELECTOR: High-End Switcher */}
        <div className="absolute bottom-24 flex items-center gap-8 pointer-events-auto">
          <SwitcherButton 
            active={activeAsset === 'gold'} 
            onClick={() => setActiveAsset('gold')} 
            label="Au. 79" 
          />
          <div className="w-[1px] h-8 bg-ivory-300 rotate-[20deg]" />
          <SwitcherButton 
            active={activeAsset === 'diamond'} 
            onClick={() => setActiveAsset('diamond')} 
            label="C. 06" 
          />
        </div>

        {/* Scroll Ingress Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 group">
          <div className="w-[1px] h-12 bg-obsidian-900 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function SwitcherButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative group transition-all duration-700 flex flex-col items-center gap-2`}
    >
      <span className={`text-[11px] font-black uppercase tracking-[0.3em] italic transition-colors ${active ? 'text-gold' : 'text-obsidian-200 hover:text-obsidian-400'}`}>
        {label}
      </span>
      <motion.div 
        animate={active ? { width: '100%', opacity: 1 } : { width: '0%', opacity: 0 }}
        className="h-[1px] bg-gold"
      />
    </button>
  )
}