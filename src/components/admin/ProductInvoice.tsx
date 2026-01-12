'use client'

import React from 'react'
import { 
  Page, 
  Text, 
  View, 
  Document, 
  StyleSheet, 
  Font 
} from '@react-pdf/renderer'

// Register fonts for a professional luxury standard
Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v21/nuFvD7K3dQY3K8p8z356396EBA.ttf',
  fontStyle: 'italic',
  fontWeight: 'medium'
})

const styles = StyleSheet.create({
  page: {
    padding: 60,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    color: '#050505',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F0E8',
    paddingBottom: 40,
    marginBottom: 40,
  },
  logoSection: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  brandSub: {
    fontSize: 8,
    color: '#C5A028',
    marginTop: 4,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  invoiceInfo: {
    textAlign: 'right',
  },
  invoiceTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#949494',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 16,
    marginTop: 5,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#949494',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  addressBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  addressText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#3D3D3D',
  },
  table: {
    width: 'auto',
    marginBottom: 40,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#050505',
    paddingBottom: 8,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F0E8',
  },
  colDesc: { width: '60%' },
  colQty: { width: '10%', textAlign: 'center' },
  colPrice: { width: '30%', textAlign: 'right' },
  
  label: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase' },
  itemTitle: { fontSize: 11, fontWeight: 'bold' },
  itemSub: { fontSize: 9, color: '#666666', marginTop: 2 },
  
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalBox: {
    width: 200,
    borderTopWidth: 2,
    borderTopColor: '#C5A028',
    paddingTop: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 'bold' },
  grandTotalValue: { fontSize: 18, fontWeight: 'bold', color: '#C5A028' },
  
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: '#F2F0E8',
    paddingTop: 20,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#949494',
    lineHeight: 1.5,
  }
})

export function ProductInvoice({ order }: { order: any }) {
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Text style={styles.brandName}>Lume Vault</Text>
            <Text style={styles.brandSub}>OFFICIAL PURCHASE DOCUMENTATION</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>Invoice Summary</Text>
            <Text style={styles.invoiceNumber}>#{order.order_number || order.id.slice(0, 8).toUpperCase()}</Text>
            <Text style={{ fontSize: 10, marginTop: 5 }}>{date}</Text>
          </View>
        </View>

        {/* CUSTOMER & PAYMENT DETAILS */}
        <View style={styles.addressBox}>
          <View style={{ width: '45%' }}>
            <Text style={styles.sectionTitle}>Customer Information</Text>
            <Text style={[styles.itemTitle, { marginBottom: 5 }]}>{order.client_name}</Text>
            <Text style={styles.addressText}>{order.shipping_address || 'Address on file'}</Text>
          </View>
          <View style={{ width: '45%', textAlign: 'right' }}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <Text style={[styles.itemTitle, { color: '#C5A028' }]}>{order.status.toUpperCase()}</Text>
            <Text style={[styles.addressText, { marginTop: 4 }]}>Method: {order.payment_method || 'Electronic Transfer'}</Text>
          </View>
        </View>

        {/* PRODUCTS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.colDesc}><Text style={styles.label}>Product Description</Text></View>
            <View style={styles.colQty}><Text style={styles.label}>Qty</Text></View>
            <View style={styles.colPrice}><Text style={styles.label}>Total Price</Text></View>
          </View>

          {order.items && order.items.length > 0 ? order.items.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>{item.name || 'Fine Jewelry Product'}</Text>
                <Text style={styles.itemSub}>SKU: {item.sku || 'N/A'}</Text>
              </View>
              <View style={styles.colQty}><Text style={styles.addressText}>{item.quantity || 1}</Text></View>
              <View style={styles.colPrice}>
                <Text style={[styles.addressText, { fontWeight: 'bold' }]}>
                  ${Number(item.price || order.total_price).toLocaleString()}
                </Text>
              </View>
            </View>
          )) : (
            <View style={styles.tableRow}>
              <View style={styles.colDesc}>
                <Text style={styles.itemTitle}>Transaction Detail</Text>
                <Text style={styles.itemSub}>Retail Order Reference</Text>
              </View>
              <View style={styles.colQty}><Text style={styles.addressText}>1</Text></View>
              <View style={styles.colPrice}>
                <Text style={[styles.addressText, { fontWeight: 'bold' }]}>
                  ${Number(order.total_price).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* SUMMARY SECTION */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <View style={styles.totalRow}>
              <Text style={styles.addressText}>Subtotal</Text>
              <Text style={styles.addressText}>${Number(order.total_price).toLocaleString()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.addressText}>Insured Shipping</Text>
              <Text style={styles.addressText}>Free</Text>
            </View>
            <View style={[styles.totalRow, { marginTop: 10 }]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>${Number(order.total_price).toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This document is an official confirmation of your order with Lume Vault.
          </Text>
          <Text style={[styles.footerText, { marginTop: 5, fontWeight: 'bold' }]}>
            All products are securely insured during transit. Thank you for choosing Lume Vault.
          </Text>
        </View>
      </Page>
    </Document>
  )
}