'use client'

import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import QRCode from 'qrcode'

// INSTITUTIONAL STYLES: Pearl & Gold Palette
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FBFBF7', // Pearl Ivory
    color: '#141414', // Obsidian
    fontFamily: 'Helvetica',
  },
  // Double-Gold Border Protocol
  borderOuter: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37', // Champagne Gold
  },
  borderInner: {
    position: 'absolute',
    top: 25,
    left: 25,
    right: 25,
    bottom: 25,
    borderWidth: 0.5,
    borderColor: '#D4AF37',
    opacity: 0.5,
  },
  header: {
    marginTop: 30,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    textTransform: 'uppercase',
    letterSpacing: 6,
    fontWeight: 'bold',
    color: '#141414',
  },
  subtitle: {
    fontSize: 8,
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginTop: 8,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 18,
    paddingHorizontal: 40,
  },
  label: {
    fontSize: 7,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 4,
  },
  qrContainer: {
    position: 'absolute',
    bottom: 120,
    right: 90,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrImage: {
    width: 70,
    height: 70,
    padding: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#D4AF37',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 90,
    right: 90,
    textAlign: 'center',
  },
  signatureArea: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  legalText: {
    fontSize: 6,
    color: '#CCCCCC',
    marginTop: 30,
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 1.5,
  },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    width: 300,
    height: 300,
    opacity: 0.03,
  }
})

export const SovereignCertificate = ({ order, item }: any) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(
          `https://lumevault.com/protocol/verification?id=${item.serial_number || item.id}`,
          { 
            margin: 1, 
            color: { dark: '#141414', light: '#FFFFFF' },
            width: 200
          }
        )
        setQrCodeUrl(url)
      } catch (err) {
        console.error("QR Generation Error:", err)
      }
    }
    generateQR()
  }, [item, order.id])

  return (
    <Document title={`LUME_CERT_${item.serial_number || 'REGISTRY'}`}>
      <Page size="A4" style={styles.page}>
        {/* I. ARCHITECTURAL BORDERS */}
        <View style={styles.borderOuter} />
        <View style={styles.borderInner} />

        {/* II. INSTITUTIONAL HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Lume Vault</Text>
          <Text style={styles.subtitle}>Official Sovereign Asset Registry</Text>
        </View>

        {/* III. ASSET SPECIFICATIONS */}
        <View style={styles.section}>
          <Text style={styles.label}>Asset Classification</Text>
          <Text style={styles.value}>{item.asset_class || 'High-Value Acquisition'}</Text>

          <Text style={styles.label}>Nomenclature / Title</Text>
          <Text style={styles.value}>{item.name || item.title}</Text>

          <Text style={styles.label}>Vault Registry Signature</Text>
          <Text style={styles.value}>{item.serial_number || 'LV-' + order.id.slice(0, 8).toUpperCase()}</Text>
        </View>

        {/* IV. VALUATION & PROVENANCE */}
        <View style={styles.section}>
          <Text style={styles.label}>Settlement Valuation (USD)</Text>
          <Text style={{ ...styles.value, color: '#D4AF37', fontWeight: 'bold' }}>
            ${Number(item.price).toLocaleString()}
          </Text>
          
          <Text style={styles.label}>Blockchain Transaction Authority</Text>
          <Text style={{ fontSize: 7, color: '#666', fontFamily: 'Courier' }}>
            {order.tx_hash || '0x71C7656EC7AB88B098defB751B7401B5f6d8976F'}
          </Text>
        </View>

        {/* V. CRYPTOGRAPHIC BRIDGE (QR) */}
        <View style={styles.qrContainer}>
          {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrImage} />}
          <Text style={{ fontSize: 5, color: '#D4AF37', marginTop: 8, letterSpacing: 1 }}>
            VERIFY ON-CHAIN CUSTODY
          </Text>
        </View>

        {/* VI. ATTESTATION & FOOTER */}
        <View style={styles.footer}>
          <View style={styles.signatureArea}>
            <View style={{ textAlign: 'left' }}>
              <Text style={styles.label}>Custodian Attestation</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Oblique', marginTop: 8 }}>Lume Vault Admin</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={styles.label}>Date of Registry</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </View>
          </View>
          
          <Text style={styles.legalText}>
            This certificate is a digital twin representing physical ownership held within the Lume Vault secure node. 
            All provenance and movement data is encrypted and immutable.
          </Text>
        </View>

      </Page>
    </Document>
  )
}