'use client'

import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import QRCode from 'qrcode'

// INSTITUTIONAL PALETTE: Pearl, Gold, & Obsidian
const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FBFBF7',
    color: '#141414',
    fontFamily: 'Helvetica',
  },
  borderOuter: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1.5,
    borderColor: '#D4AF37',
  },
  borderInner: {
    position: 'absolute',
    top: 26,
    left: 26,
    right: 26,
    bottom: 26,
    borderWidth: 0.5,
    borderColor: '#D4AF37',
    opacity: 0.4,
  },
  header: {
    marginTop: 40,
    marginBottom: 60,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    textTransform: 'uppercase',
    letterSpacing: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 9,
    color: '#D4AF37',
    textTransform: 'uppercase',
    letterSpacing: 4,
    marginTop: 10,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 20,
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 7,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 5,
  },
  qrContainer: {
    position: 'absolute',
    bottom: 110,
    right: 80,
    alignItems: 'center',
  },
  qrImage: {
    width: 80,
    height: 80,
    padding: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: '#D4AF37',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 80,
    right: 80,
  },
  signatureArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    borderTopWidth: 0.5,
    borderTopColor: '#EEEEEE',
    paddingTop: 20,
  },
  legalText: {
    fontSize: 6,
    color: '#AAAAAA',
    marginTop: 40,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    lineHeight: 1.6,
  }
})

export const SovereignCertificate = ({ order, item }: any) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      try {
        // Pointing to our new universal verification page
        const url = await QRCode.toDataURL(
          `https://lumevault.com/verify?id=${item.serial_number || item.id}`,
          { 
            margin: 1, 
            color: { dark: '#141414', light: '#FFFFFF' },
            width: 250
          }
        )
        setQrCodeUrl(url)
      } catch (err) {
        console.error("QR Generation Error:", err)
      }
    }
    generateQR()
  }, [item])

  return (
    <Document title={`LUME_CERT_${item.serial_number || 'VAULT'}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.borderOuter} />
        <View style={styles.borderInner} />

        <View style={styles.header}>
          <Text style={styles.title}>LUME VAULT</Text>
          <Text style={styles.subtitle}>OFFICIAL AUTHENTICITY REGISTRY</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Asset Classification</Text>
          <Text style={styles.value}>{item.category || 'High-Value Asset'}</Text>

          <Text style={styles.label}>Nomenclature</Text>
          <Text style={styles.value}>{item.name}</Text>

          <Text style={styles.label}>Registry Signature (Serial)</Text>
          <Text style={styles.value}>{item.serial_number || `LV-${order.id.slice(0, 8).toUpperCase()}`}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Settlement Valuation</Text>
          <Text style={{ ...styles.value, color: '#D4AF37' }}>
            USD {Number(item.price).toLocaleString()}
          </Text>
          
          <Text style={styles.label}>Settlement Authority (TX Hash)</Text>
          <Text style={{ fontSize: 7, color: '#666' }}>
            {order.tx_hash || 'PENDING_BLOCKCHAIN_CONFIRMATION'}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrImage} />}
          <Text style={{ fontSize: 5, color: '#D4AF37', marginTop: 10, letterSpacing: 1 }}>
            SCAN TO VERIFY PROVENANCE
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.signatureArea}>
            <View>
              <Text style={styles.label}>Vault Custodian</Text>
              <Text style={{ fontSize: 11, marginTop: 5 }}>Lume Vault Authority</Text>
            </View>
            <View style={{ textAlign: 'right' }}>
              <Text style={styles.label}>Registry Date</Text>
              <Text style={{ fontSize: 11, marginTop: 5 }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </View>
          </View>
          
          <Text style={styles.legalText}>
            This certificate serves as the official digital twin of physical assets held in secure custody.
            The provenance of this asset is immutable and recorded on the sovereign ledger.
          </Text>
        </View>
      </Page>
    </Document>
  )
}