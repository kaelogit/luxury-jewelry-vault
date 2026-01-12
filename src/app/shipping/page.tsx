/* ... existing imports ... */

// Updated Client Care Column inside Footer.tsx
<div className="space-y-6">
  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Client Care</h4>
  <ul className="space-y-4">
    <FooterLink href="/shipping" label="Shipping & Logistics" />
    <FooterLink href="/returns" label="Returns & Exchanges" />
    <FooterLink href="/track" label="Track Your Order" />
    <FooterLink href="/faq" label="Common Questions" />
    {/* Bespoke Link Removed */}
  </ul>
</div>

/* ... rest of the footer ... */