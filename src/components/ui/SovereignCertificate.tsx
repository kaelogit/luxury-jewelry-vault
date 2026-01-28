'use client'

import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import QRCode from 'qrcode'

// Register Fonts
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v21/nuFvD7K3dQY3K8p8z356396EBA.ttf',
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    color: '#121212',
    fontFamily: 'Helvetica',
  },
  frameOuter: {
    position: 'absolute',
    top: 20, left: 20, right: 20, bottom: 20,
    borderWidth: 1,
    borderColor: '#C5A028',
  },
  frameInner: {
    position: 'absolute',
    top: 25, left: 25, right: 25, bottom: 25,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  header: {
    marginTop: 60,
    marginBottom: 50,
    textAlign: 'center',
  },
  brandName: {
    fontFamily: 'Playfair Display',
    fontSize: 28,
    textTransform: 'uppercase',
    letterSpacing: 4,
    color: '#000000',
  },
  certTitle: {
    fontSize: 8,
    color: '#C5A028',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginTop: 8,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: 40,
  },
  row: {
    marginBottom: 25,
  },
  label: {
    fontSize: 7,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  valueLarge: {
    fontSize: 16,
    fontFamily: 'Playfair Display',
    textTransform: 'uppercase',
    color: '#111827',
  },
  valueMedium: {
    fontSize: 12,
    color: '#111827',
    letterSpacing: 0.5,
  },
  valueGold: {
    fontSize: 12,
    color: '#C5A028',
    fontWeight: 'bold',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    right: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  signatureBlock: {
    textAlign: 'right',
  },
  signLine: {
    width: 150,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    marginBottom: 8,
  },
  legalText: {
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 6,
    color: '#D1D5DB',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})

export default function SovereignCertificate({ order, item }: { order: any; item: any }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      // Safety check inside effect
      if (!item) return
      
      try {
        const url = await QRCode.toDataURL(
          `https://lumevault.com/verify?id=${item?.serial_number || item?.id}`,
          { 
            margin: 0, 
            color: { dark: '#000000', light: '#FFFFFF' },
            width: 150
          }
        )
        setQrCodeUrl(url)
      } catch (err) {
        console.error("QR Error:", err)
      }
    }
    generateQR()
  }, [item])

  // CRITICAL FIX: If item is missing during render, provide a placeholder or return null
  if (!item) {
    return (
      <Document title="Error">
        <Page size="A4" style={styles.page}>
          <Text>Certificate data is unavailable.</Text>
        </Page>
      </Document>
    )
  }

  return (
    <Document title={`CERT-${item?.serial_number || 'LUME'}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        
        {/* I. FRAMING */}
        <View style={styles.frameOuter} />
        <View style={styles.frameInner} />

        {/* II. BRAND HEADER */}
        <View style={styles.header}>
          <Text style={styles.brandName}>Lume Vault</Text>
          <Text style={styles.certTitle}>Certificate of Authenticity</Text>
        </View>

        {/* III. ASSET DETAILS */}
        <View style={styles.contentContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            
            {/* Left Column */}
            <View style={{ width: '60%' }}>
              <View style={styles.row}>
                <Text style={styles.label}>Item Description</Text>
                <Text style={styles.valueLarge}>{item?.name || 'Unknown Asset'}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', gap: 40 }}>
                <View>
                  <Text style={styles.label}>Category</Text>
                  <Text style={styles.valueMedium}>{item?.category || 'Fine Jewelry'}</Text>
                </View>
                <View>
                  <Text style={styles.label}>Reference / SKU</Text>
                  <Text style={styles.valueMedium}>{item?.sku || 'N/A'}</Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={{ width: '35%', alignItems: 'flex-end' }}>
              <View style={styles.row}>
                <Text style={[styles.label, { textAlign: 'right' }]}>Reference ID</Text>
                <Text style={styles.valueMedium}>{item?.serial_number || item?.id?.slice(0, 12).toUpperCase() || 'REGISTRY'}</Text>
              </View>
              
              <View style={styles.row}>
                <Text style={[styles.label, { textAlign: 'right' }]}>Appraised Value</Text>
                <Text style={styles.valueGold}>USD {Number(item?.price || 0).toLocaleString()}</Text>
              </View>
            </View>

          </View>
        </View>

        {/* IV. BOTTOM VERIFICATION */}
        <View style={styles.bottomSection}>
          <View>
            {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
            <Text style={{ fontSize: 6, marginTop: 4, letterSpacing: 1 }}>SCAN TO VERIFY</Text>
          </View>

          <View style={styles.signatureBlock}>
            <View style={styles.signLine} />
            <Text style={styles.label}>Authorized Signature</Text>
            <Text style={{ fontSize: 8, marginTop: 2 }}>
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        </View>

        <Text style={styles.legalText}>
          Lume Vault International • This document certifies the authenticity and provenance of the item described herein.
        </Text>

      </Page>
    </Document>
  )
}