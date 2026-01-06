'use client'

import React, { useState } from 'react'
import { Zap, ShieldCheck, Fingerprint, ArrowRight, Download, Award, AlertCircle, Loader2, Globe, FileCheck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import jsPDF from 'jspdf'

export default function VerificationProtocol() {
  const [certId, setCertId] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [certData, setCertData] = useState<any>(null)
  const [error, setError] = useState('')

  const formatInput = (input: string) => {
    let clean = input.toUpperCase().replace(/\s+/g, '')
    if (clean.startsWith('GIA') && !clean.includes('-')) {
      clean = clean.replace('GIA', 'GIA-')
    }
    return clean
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certId) return

    setIsVerifying(true)
    setError('')
    setCertData(null)

    const sanitizedId = formatInput(certId)

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .or(`gia_report_number.eq.${sanitizedId},serial_number.eq.${sanitizedId}`)
        .single()

      if (fetchError || !data) {
        setError('Asset signature not recognized in Sovereign Registry.')
      } else {
        setCertData(data)
      }
    } catch (err) {
      setError('Handshake failure. System node unreachable.')
    } finally {
      setIsVerifying(false)
    }
  }

  // REBUILT: Opulent PDF Generation (Pearl & Gold Theme)
  const generateSovereignPDF = () => {
    if (!certData) return
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    
    // Background: Pearl/Ivory Canvas
    doc.setFillColor(252, 251, 247)
    doc.rect(0, 0, 210, 297, 'F')
    
    // Gold Border (Champagne Gold)
    doc.setDrawColor(212, 175, 55)
    doc.setLineWidth(0.8)
    doc.rect(10, 10, 190, 277)
    doc.setLineWidth(0.2)
    doc.rect(12, 12, 186, 273)

    // Branding: Obsidian & Gold
    doc.setTextColor(20, 20, 20)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(28)
    doc.text('LUME VAULT', 105, 45, { align: 'center', charSpace: 5 })
    
    doc.setTextColor(212, 175, 55)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('OFFICIAL SOVEREIGN AUTHENTICATION REGISTER', 105, 53, { align: 'center', charSpace: 2 })

    // Fine Separator
    doc.setDrawColor(212, 175, 55)
    doc.line(85, 60, 125, 60)

    // Asset Title
    doc.setTextColor(20, 20, 20)
    doc.setFontSize(22)
    doc.setFont('times', 'italic')
    doc.text(certData.title.toUpperCase(), 105, 90, { align: 'center' })

    // Data Matrix
    const startY = 130
    const rowHeight = 18

    const addDataRow = (label: string, value: string, y: number) => {
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(label.toUpperCase(), 35, y)
      
      doc.setTextColor(20, 20, 20)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      doc.text(value.toUpperCase(), 175, y, { align: 'right' })
      
      doc.setDrawColor(230, 230, 230)
      doc.line(35, y + 5, 175, y + 5)
    }

    addDataRow('Asset Classification', certData.asset_class, startY)
    addDataRow('Registry Signature', certData.serial_number, startY + rowHeight)

    if (certData.asset_class === 'WATCH') {
      addDataRow('Reference No.', certData.specifications?.reference || 'Verified', startY + (rowHeight * 2))
      addDataRow('Calibre Movement', certData.specifications?.movement || 'Certified', startY + (rowHeight * 3))
    } else if (certData.asset_class === 'DIAMOND') {
      addDataRow('GIA Report ID', certData.gia_report_number || 'Authenticated', startY + (rowHeight * 2))
      addDataRow('Color / Clarity', `${certData.specifications?.color} / ${certData.specifications?.clarity}`, startY + (rowHeight * 3))
    } else {
      addDataRow('Fine Purity', certData.gold_purity || '999.9 Fine', startY + (rowHeight * 2))
      addDataRow('Authenticated Mass', certData.specifications?.weight || 'Verified', startY + (rowHeight * 3))
    }

    addDataRow('Custody Protocol', certData.status || 'Secured', startY + (rowHeight * 4))

    // Footer Security Seals
    doc.setTextColor(212, 175, 55)
    doc.setFontSize(8)
    doc.text('THIS DIGITAL CERTIFICATE IS PHYSICALLY LINKED TO VAULT ASSETS', 105, 260, { align: 'center' })
    
    doc.setTextColor(180, 180, 180)
    doc.setFontSize(7)
    doc.text(`AUDIT TIMESTAMP: ${new Date().toUTCString()}`, 105, 268, { align: 'center' })

    doc.save(`LUME_REGISTRY_${certData.serial_number}.pdf`)
  }

  return (
    <main className="min-h-screen bg-ivory-100 pt-32 md:pt-48 pb-32 px-6 selection:bg-gold selection:text-white">
      <div className="max-w-[1200px] mx-auto">
        
        {/* I. MASTER HEADER */}
        <header className="text-center mb-32 space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-6 py-2 bg-white border border-gold/20 rounded-full shadow-sm"
          >
             <Fingerprint size={16} className="text-gold" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gold italic">Registry Audit v2.0</span>
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-7xl md:text-9xl font-light text-obsidian-900 tracking-tighter italic leading-none">
              Asset <span className="text-obsidian-400 underline decoration-gold/20 underline-offset-[1.5rem]">Proof.</span>
            </h1>
            <p className="text-obsidian-400 text-[11px] font-black uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed italic">
              Verification of physical provenance and global registry signatures.
            </p>
          </div>
        </header>

        {/* II. INPUT COMMAND CENTER */}
        <section className="mb-40">
          <form onSubmit={handleVerify} className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gold/10 blur-2xl rounded-[2rem] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
            <input 
              type="text" 
              placeholder="GIA IDENTIFIER OR LV-SERIAL..."
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="relative w-full bg-white border border-ivory-300 rounded-[2rem] py-10 px-12 text-obsidian-900 font-mono text-lg outline-none focus:border-gold/40 transition-all uppercase placeholder:text-ivory-300 shadow-2xl"
            />
            <button 
              type="submit" 
              disabled={isVerifying} 
              className="absolute right-5 top-5 bottom-5 px-12 bg-obsidian-900 text-gold rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all duration-500 flex items-center gap-4 shadow-xl disabled:opacity-50 active:scale-95"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={16}/> : 'Authenticate'} <ArrowRight size={16} />
            </button>
          </form>
          
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mt-10 text-red-500 font-bold uppercase tracking-widest text-[10px]">
                <AlertCircle size={14} /> {error}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* III. THE REVEAL: Digital Twin Appraisal */}
        <AnimatePresence mode="wait">
          {certData && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="bg-white border border-ivory-300 rounded-[5rem] p-12 md:p-24 relative overflow-hidden shadow-2xl"
            >
              <Award className="absolute -right-32 -bottom-32 text-gold/[0.04] w-[600px] h-[600px] rotate-12" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-24 border-b border-ivory-100 pb-16">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_15px_gold] animate-pulse" />
                      <p className="text-[11px] font-black text-gold uppercase tracking-[0.6em] italic">Identity Match Verified</p>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-light text-obsidian-900 italic tracking-tighter leading-tight uppercase">
                      {certData.title}
                    </h2>
                  </div>
                  <div className="p-8 bg-ivory-50 rounded-[3rem] border border-ivory-200 shadow-inner group">
                    <ShieldCheck size={48} className="text-gold group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-32 mb-24">
                  <SpecDetail label="Asset Class" value={certData.asset_class} icon={<Globe size={14}/>} />
                  <SpecDetail label="Registry Signature" value={certData.serial_number} icon={<FileCheck size={14}/>} />
                  
                  {certData.asset_class === 'WATCH' ? (
                    <>
                      <SpecDetail label="Model Reference" value={certData.specifications?.reference || 'VERIFIED'} icon={<Fingerprint size={14}/>} />
                      <SpecDetail label="Calibre Movement" value={certData.specifications?.movement || 'CERTIFIED'} icon={<Zap size={14}/>} />
                    </>
                  ) : certData.asset_class === 'DIAMOND' ? (
                    <>
                      <SpecDetail label="GIA Identity" value={certData.gia_report_number || 'VERIFIED'} icon={<Award size={14}/>} />
                      <SpecDetail label="Clarity Profile" value={`${certData.specifications?.clarity} / ${certData.specifications?.color}`} icon={<ShieldCheck size={14}/>} />
                    </>
                  ) : (
                    <>
                      <SpecDetail label="Mint Purity" value={certData.gold_purity || '999.9 FINE'} icon={<Award size={14}/>} />
                      <SpecDetail label="Physical Mass" value={certData.specifications?.weight || 'AUTHENTICATED'} icon={<Zap size={14}/>} />
                    </>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                   <div className="space-y-2">
                      <p className="text-[9px] font-black text-obsidian-300 uppercase tracking-widest italic">Official Protocol Document</p>
                      <p className="text-xs text-obsidian-400 font-medium">Issued on {new Date(certData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                   <button 
                    onClick={generateSovereignPDF} 
                    className="group w-full md:w-auto px-16 py-8 bg-obsidian-900 text-gold rounded-[2rem] text-[12px] font-black uppercase tracking-[0.5em] hover:bg-gold hover:text-white transition-all duration-700 flex items-center justify-center gap-4 shadow-2xl active:scale-95"
                  >
                    Download Sovereign PDF <Download size={20} className="group-hover:translate-y-1 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}

function SpecDetail({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="space-y-6 group">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-ivory-50 rounded-lg text-gold opacity-50 group-hover:opacity-100 transition-opacity">
          {icon}
        </div>
        <p className="text-[10px] font-black text-obsidian-300 uppercase tracking-[0.4em] italic">{label}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-10 w-[1.5px] bg-gold/30 rounded-full group-hover:bg-gold transition-colors duration-500" />
        <p className="text-3xl font-light text-obsidian-900 tracking-tighter italic uppercase">{value}</p>
      </div>
    </div>
  )
}