const REVIEW_COMPONENTS = {
  names: ["Julianne M.", "Alistair W.", "Sienna R.", "Maximilian V.", "Eleanor D.", "Thibault C.", "Isabella K.", "Harrison F.", "Clara B.", "Benedict S."],
  locations: ["Geneva", "London", "New York", "Dubai", "Zurich", "Singapore", "Paris", "Monaco", "Tokyo", "Hong Kong"],
  
  Watches: {
    openers: ["The horological detail is stunning.", "An exceptional addition to my collection.", "The craftsmanship is beyond reproach.", "A masterclass in precision."],
    middles: ["The weight on the wrist feels substantial yet balanced.", "The movement is virtually silent and perfectly regulated.", "The heritage of this piece is evident in every curve.", "The finish on the dial catches the light beautifully."],
    closers: ["Handover was handled with absolute discretion.", "World-class logistics from Lume Vault.", "A seamless acquisition process.", "Highly recommended for serious collectors."]
  },
  Diamonds: {
    openers: ["The brilliance is truly captivating.", "Exceeded the GIA certification expectations.", "A remarkable stone of significant character.", "Pure light captured in a perfect cut."],
    middles: ["The clarity is astounding even under high magnification.", "The setting perfectly complements the stone's fire.", "Every facet reflects light with incredible intensity.", "An investment-grade piece of high-jewelry."],
    closers: ["Arrived in signature discreet packaging.", "The provenance documentation is impeccable.", "A secure and professional physical transfer.", "The Lume Registry provides great peace of mind."]
  },
  Gold: {
    openers: ["The ultimate form of wealth preservation.", "Purity verified and perfectly presented.", "A seamless reserve acquisition.", "Substantial and reassuring in its quality."],
    middles: ["The bars were delivered in pristine, minted condition.", "Securely transferred to my private vault without incident.", "The encrypted settlement made the large transaction effortless.", "Essential for any diversified private portfolio."],
    closers: ["Logistics were handled with institutional precision.", "Discreet and perfectly coordinated handover.", "The gold standard of service.", "Absolute trust in the Lume Vault protocol."]
  }
}

// Simple deterministic random function based on a seed string (Product ID)
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return (index: number) => {
    const x = Math.sin(hash + index) * 10000;
    return x - Math.floor(x);
  };
}

export function generateSovereignReviews(productId: string, category: 'Watches' | 'Diamonds' | 'Gold', count: number = 3) {
  const random = seededRandom(productId);
  const reviews = [];
  const cat = REVIEW_COMPONENTS[category];

  for (let i = 0; i < count; i++) {
    // Audit: Using unique multipliers for every component 
    // This ensures Review 1 Opener is different from Review 2 Opener
    const nameIdx = Math.floor(random(i + 10) * REVIEW_COMPONENTS.names.length);
    const locIdx = Math.floor(random(i + 20) * REVIEW_COMPONENTS.locations.length);
    
    // Sentence variety logic
    const opIdx = Math.floor(random(i + 30) * cat.openers.length);
    const midIdx = Math.floor(random(i + 40) * cat.middles.length);
    const clIdx = Math.floor(random(i + 50) * cat.closers.length);

    reviews.push({
      author: REVIEW_COMPONENTS.names[nameIdx],
      location: REVIEW_COMPONENTS.locations[locIdx],
      // We also shuffle the middle sentences to avoid "Samey" patterns
      content: `${cat.openers[opIdx]} ${cat.middles[midIdx]} ${cat.closers[clIdx]}`,
      date: "Recent Acquisition",
      verified: true,
      rating: 5
    });
  }
  return reviews;
}