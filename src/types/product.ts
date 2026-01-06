export type AssetHouse = 'gold' | 'diamonds' | 'jewelry' | 'watches';

export interface BaseProduct {
  id: string;
  name: string;
  slug: string;
  house: AssetHouse;
  price_usd: number;
  main_image: string;
  image_gallery: string[];
  description: string;
  is_verified: boolean;
  verification_id?: string;
}

// Specific Metadata for Each House
export interface GoldMetadata {
  weight: string;     // e.g., "1kg" or "50g"
  purity: string;     // e.g., "24K" or "999.9"
  mint: string;       // e.g., "Swiss PAMP"
}

export interface DiamondMetadata {
  carat: number;
  clarity: string;    // e.g., "VVS1"
  color: string;      // e.g., "D"
  cut: string;        // e.g., "Excellent"
  gia_report: string; 
}

export interface WatchMetadata {
  brand: string;
  model: string;
  year: number;
  movement: string;   // e.g., "Automatic Calibre 324"
  case_material: string;
  condition: 'Unworn' | 'Mint' | 'Excellent';
}

export interface JewelryMetadata {
  material: string;   // e.g., "Solid 18K Gold"
  stone_type?: string;
  length_size?: string;
}

// The Final Combined Type
export type LuxuryProduct = BaseProduct & {
  metadata: GoldMetadata | DiamondMetadata | WatchMetadata | JewelryMetadata;
};