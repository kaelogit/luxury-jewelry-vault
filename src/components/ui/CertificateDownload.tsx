'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { SovereignCertificate } from '@/components/admin/SovereignCertificate'
import { Download, Loader2 } from 'lucide-react'

export default function CertificateDownload({ order, item }: any) {
  return (
    <PDFDownloadLink 
      document={<SovereignCertificate order={order} item={item} />} 
      fileName={`LUME_CERT_${item.serial_number || 'REGISTRY'}.pdf`}
    >
      {({ blob, url, loading, error }) => (
        <button 
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-obsidian-900 text-gold rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold hover:text-white transition-all"
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : <Download size={14} />}
          {loading ? 'Generating Registry...' : 'Download Ownership Certificate'}
        </button>
      )}
    </PDFDownloadLink>
  )
}