// src/lib/reviewGenerator.ts

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  date: string;
}

const generatePool = (category: 'gold' | 'diamond' | 'watch', count: number): Review[] => {
  const reviews: Review[] = [];

  const authors = ["Member", "Collector", "Sovereign", "Registry", "Estate"];
  
  const vocab = {
    gold: {
      prefix: ["The 24K density is remarkable.", "Exceptional purity confirmed.", "A masterwork of bullion.", "The luster is breathtaking.", "A superior inflation hedge."],
      middle: ["Verified the weight independently.", "The armored delivery protocol was precise.", "The craftsmanship is sovereign.", "Fits perfectly into my private estate.", "The price oracle provided a fair entry."],
      suffix: ["Highly recommended for serious collectors.", "Will be acquiring more soon.", "Lume Vault remains my primary source.", "Flawless execution.", "Discretion was absolute."]
    },
    diamond: {
      prefix: ["The VVS1 clarity is breathtaking.", "GIA report verified instantly.", "The fire and scintillation are superior.", "A significant addition to my estate.", "Mathematically perfect cut."],
      middle: ["The light performance is incredible.", "Sourced via the Bespoke Hub perfectly.", "The provenance is impeccably clean.", "Far superior to high-res photography.", "The security handshake was reassuring."],
      suffix: ["A world-class gemstone.", "Exceeded every expectation.", "Truly a centerpiece acquisition.", "Exceptional brilliance.", "The ultimate gift."]
    },
    watch: {
      prefix: ["The movement is pristine.", "Investment grade reference.", "A rare horological find.", "Condition is better than described.", "The caliber timing is flawless."],
      middle: ["The patina is exactly as I wanted.", "Box and papers authenticated by concierge.", "Running well within COSC standards.", "A masterwork of mechanical engineering.", "Off-market sourcing at its finest."],
      suffix: ["An absolute masterpiece.", "Professional logistics throughout.", "The perfect vintage reference.", "A must-have for the vault.", "Elite service."]
    }
  };

  for (let i = 0; i < count; i++) {
    const p = vocab[category].prefix[i % vocab[category].prefix.length];
    const m = vocab[category].middle[(i + 7) % vocab[category].middle.length];
    const s = vocab[category].suffix[(i + 13) % vocab[category].suffix.length];
    
    reviews.push({
      id: `${category}-${i}`,
      author: `${authors[i % authors.length]} #${1000 + i}`,
      content: `${p} ${m} ${s}`,
      rating: 5,
      date: 'VERIFIED ACQUISITION'
    });
  }

  return reviews;
};

// EXPORT THE FULL 3,000 REGISTRY
export const ALL_REVIEWS = {
  gold: generatePool('gold', 1000),
  diamond: generatePool('diamond', 1000),
  watch: generatePool('watch', 1000)
};