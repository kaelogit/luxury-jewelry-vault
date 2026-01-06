'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // AUDIT: Deliberate Spring Physics (Damping increased for "Heavy Luxury" feel)
  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 }
  const ringX = useSpring(cursorX, springConfig)
  const ringY = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isSelectable = target.closest('button, a, input, [role="button"], .interactive-asset')
      setIsHovering(!!isSelectable)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', handleHover)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', handleHover)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [cursorX, cursorY])

  return (
    <div className="hidden md:block">
      {/* I. THE SOVEREIGN HALO (The Outer Ring) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 40,
          height: 40,
          // Sync with Pearl & Gold theme
          borderColor: isHovering ? 'rgba(212, 175, 55, 0.4)' : 'rgba(10, 10, 10, 0.15)',
        }}
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(212, 175, 55, 0.03)' : 'transparent',
          borderWidth: isHovering ? '1.5px' : '1px',
        }}
        transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      />

      {/* II. THE FOCUS PIN (The Inner Dot) */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          width: 4,
          height: 4,
          // Primary interaction color
          backgroundColor: isHovering ? '#D4AF37' : '#0A0A0A',
        }}
        animate={{
          scale: isClicking ? 2 : isHovering ? 0.5 : 1,
          opacity: isClicking ? 0.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}