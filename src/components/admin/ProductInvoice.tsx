'use client'

import React from 'react'
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet 
} from '@react-pdf/renderer'

// --- I. STYLE CONFIGURATION ---
// Removed external Font registration to fix the "Unknown font format" crash.
// We are now using standard Helvetica (System Font) for maximum reliability.
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica', 
    color: '#121212',
    fontSize: 10,
  },
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 20,
  },
  brandName: {
    fontSize: 24,
    textTransform: 'uppercase',
    color: '#000000',
    fontWeight: 'bold',
  },
  brandSub: {
    fontSize: 7,
    color: '#C5A028', 
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  invoiceMeta: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 14,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  invoiceId: {
    fontSize: 9,
    color: '#6B7280',
    letterSpacing: 1,
  },

  // CLIENT DATA
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  sectionLabel: {
    fontSize: 7,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#111827',
  },

  // TABLE
  table: {
    width: '100%',
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 8,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  colDesc: { width: '50%' },
  colSku: { width: '20%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '20%', textAlign: 'right' },
  
  colHeaderLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // SUMMARY
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  totalBox: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#C5A028',
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
  grandTotalValue: {
    fontSize: 14,
    color: '#C5A028',
    fontWeight: 'bold',
  },

  // FOOTER
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    textAlign: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5E5',
    paddingTop: 15,
  },
  footerText: {
    fontSize: 7,
    color: '#9CA3AF',
    letterSpacing: 0.5,
    lineHeight: 1.5,
  }
})

export function ProductInvoice({ order }: { order: any }) {
  // PREVENT CRASH: Stop building if data is empty
  if (!order) return null;

  const date = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  const items = Array.isArray(order.items) ? order.items : []
  const total = Number(order.total_price || 0)

  return (
    <Document title={`Invoice-${order.id}`}>
      <Page size="A4" style={styles.page}>
        
        {/* I. HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Lume Vault</Text>
            <Text style={styles.brandSub}>Official Purchase Record</Text>
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
            <Text style={styles.invoiceId}>Ref: {order.tracking_number || order.id?.slice(0, 8).toUpperCase() || 'PENDING'}</Text>
            <Text style={[styles.invoiceId, { marginTop: 2 }]}>{date}</Text>
          </View>
        </View>

        {/* II. CLIENT & PAYMENT */}
        <View style={styles.infoGrid}>
          <View style={{ width: '45%' }}>
            <Text style={styles.sectionLabel}>Client Information</Text>
            <Text style={[styles.infoText, { fontWeight: 'bold' }]}>{order.client_name || 'Guest User'}</Text>
            <Text style={styles.infoText}>{order.shipping_address || 'Collection from Vault'}</Text>
            <Text style={styles.infoText}>{order.email || order.client_email || ''}</Text>
          </View>
          <View style={{ width: '45%', alignItems: 'flex-end' }}>
            <Text style={styles.sectionLabel}>Verification Status</Text>
            <Text style={[styles.infoText, { color: '#C5A028', fontWeight: 'bold', textTransform: 'uppercase' }]}>
              {order.status || 'Active'}
            </Text>
            <Text style={styles.infoText}>Payment: {order.payment_method || 'Direct Payment'}</Text>
          </View>
        </View>

        {/* III. ITEMS */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}><Text style={styles.colHeaderLabel}>Item</Text></View>
            <View style={styles.colSku}><Text style={styles.colHeaderLabel}>Reference</Text></View>
            <View style={styles.colQty}><Text style={styles.colHeaderLabel}>Qty</Text></View>
            <View style={styles.colPrice}><Text style={styles.colHeaderLabel}>Price</Text></View>
          </View>

          {items.length > 0 ? items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow} wrap={false}>
              <View style={styles.colDesc}>
                <Text style={{ fontWeight: 'bold' }}>{item.name || 'Luxury Reference'}</Text>
                <Text style={{ fontSize: 7, color: '#6B7280', marginTop: 2 }}>{item.category || 'Fine Jewelry'}</Text>
              </View>
              <View style={styles.colSku}>
                <Text style={{ fontSize: 8 }}>{item.sku || item.id?.slice(0, 8) || '--'}</Text>
              </View>
              <View style={styles.colQty}>
                <Text>1</Text>
              </View>
              <View style={styles.colPrice}>
                <Text>${Number(item.price || 0).toLocaleString()}</Text>
              </View>
            </View>
          )) : (
            <View style={styles.tableRow}>
              <View style={styles.colDesc}><Text>Registered Assets</Text></View>
              <View style={styles.colSku}><Text>--</Text></View>
              <View style={styles.colQty}><Text>1</Text></View>
              <View style={styles.colPrice}><Text>${total.toLocaleString()}</Text></View>
            </View>
          )}
        </View>

        {/* IV. TOTALS */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text>${total.toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Insurance & Handling</Text>
              <Text>Included</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text style={{ fontWeight: 'bold' }}>Total Price</Text>
              <Text style={styles.grandTotalValue}>${total.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* V. FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>LUME VAULT INTERNATIONAL • PRIVATE ASSET REGISTRY</Text>
          <Text style={[styles.footerText, { marginTop: 4 }]}>
            This document serves as official proof of payment and ownership.
            Please retain for insurance and registry purposes.
          </Text>
        </View>

      </Page>
    </Document>
  )
}