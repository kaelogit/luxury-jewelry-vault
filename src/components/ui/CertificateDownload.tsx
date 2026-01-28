'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import SovereignCertificate from '@/components/ui/SovereignCertificate' // FIX: Default import
import { Download, Loader2, FileCheck } from 'lucide-react'

export default function CertificateDownload({ order, item }: any) {
  return (
    <PDFDownloadLink 
      document={<SovereignCertificate order={order} item={item} />} 
      fileName={`LUME_CERT_${item.serial_number || 'REGISTRY'}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button 
          disabled={loading}
          className="group flex items-center gap-3 px-8 py-4 bg-obsidian-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gold hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
        >
          {loading ? (
            <Loader2 className="animate-spin text-gold" size={14} />
          ) : (
            <FileCheck size={14} className="text-gold group-hover:text-black transition-colors" />
          )}
          <span>{loading ? 'Minting Document...' : 'Download Certificate'}</span>
        </button>
      )}
    </PDFDownloadLink>
  )
}