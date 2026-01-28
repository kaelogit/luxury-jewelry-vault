import { PRODUCT_REVIEWS } from './reviewData'

/**
 * INSTITUTIONAL VOCABULARY EXPANSION
 * Used to construct unique variations if the primary registry is exhausted.
 */
const SENTENCE_POOL = {
  Watches: {
    openers: [
      "The mechanical calibration and weight of this reference are beyond reproach.",
      "An exceptional addition to my horological registry.",
      "The craftsmanship reflects a level of precision rarely seen in modern pieces.",
      "A masterclass in horological engineering and aesthetic balance."
    ],
    middles: [
      "The movement is virtually silent and perfectly regulated for chronometric performance.",
      "The finish on the dial catches the light with remarkable clarity.",
      "Every internal component was clearly vetted with extreme scrutiny.",
      "The hand-finished escapement is a testament to the heritage of the maker."
    ],
    closers: [
      "Handover was executed with absolute institutional discretion.",
      "World-class logistics; the provenance documentation is world-class.",
      "A seamless acquisition path for a high-value reference.",
      "Lume Vault remains the only trusted source for my horological portfolio."
    ]
  },
  Diamonds: {
    openers: [
      "The refractive index and scintillation of this stone are truly breathtaking.",
      "Exceeded the GIA certification expectations in every measurable metric.",
      "A remarkable asset of museum-grade character and brilliance.",
      "Pure light captured within a structurally perfect cut."
    ],
    middles: [
      "The clarity is astounding, even under high-powered magnification.",
      "The setting provides a perfect platform for the stone's natural fire.",
      "The spectral play across every facet reflects incredible intensity.",
      "A significant acquisition for any serious collector of high-jewelry."
    ],
    closers: [
      "Arrived in secure, signature minimalist vault packaging.",
      "The digital twin on the Sovereign Registry provides total peace of mind.",
      "A secure and professional physical transfer of a high-carat asset.",
      "The documentation provided is exhaustive and unimpeachable."
    ]
  },
  Gold: {
    openers: [
      "The quintessential form of wealth preservation, perfectly presented.",
      "Purity verified and delivered with Swiss-level precision.",
      "A seamless reserve acquisition for my private portfolio.",
      "Substantial, reassuring, and minted to the highest LBMA standards."
    ],
    middles: [
      "The bars were delivered in pristine condition with an unbroken line of custody.",
      "Securely transferred to my private vault via an armored logistics chain.",
      "The encrypted settlement protocol made the large-scale transfer effortless.",
      "Essential for a diversified strategy in an era of fiscal volatility."
    ],
    closers: [
      "Logistics were handled with the institutional precision Lume is known for.",
      "A discreet and perfectly coordinated handover of physical assets.",
      "The gold standard of secure acquisition and stewardship.",
      "Total trust in the Lume Vault protocol; highly recommended."
    ]
  }
}

/**
 * SEEDED RANDOM
 * Ensures the reviews stay consistent for a specific product across reloads.
 */
const seededRandom = (seed: string) => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return (index: number) => {
    const x = Math.sin(hash + index) * 10000
    return x - Math.floor(x)
  }
}

/**
 * SOVEREIGN REVIEW GENERATOR
 */
export function generateSovereignReviews(
  productId: string, 
  category: 'Watches' | 'Diamonds' | 'Gold', 
  count: number = 3
) {
  const random = seededRandom(productId)
  const reviews = []
  
  // 1. Prioritize real hand-written reviews from your reviewData registry
  const curatedPool = PRODUCT_REVIEWS[category] || []
  const usedCuratedIndices = new Set()

  for (let i = 0; i < count; i++) {
    // If we have curated reviews left, pick one deterministically
    if (usedCuratedIndices.size < curatedPool.length) {
      let curatedIdx = Math.floor(random(i) * curatedPool.length)
      
      // Basic collision avoidance for the curated pool
      while (usedCuratedIndices.has(curatedIdx)) {
        curatedIdx = (curatedIdx + 1) % curatedPool.length
      }
      
      usedCuratedIndices.add(curatedIdx)
      reviews.push(curatedPool[curatedIdx])
    } else {
      // 2. Fallback to the Smart Constructor for unique variations
      const pool = SENTENCE_POOL[category]
      const names = ["Maximilian V.", "Alistair W.", "Sienna R.", "Julianne M.", "Harrison F.", "Thibault C."]
      const locations = ["Geneva", "Zurich", "London", "Dubai", "Singapore", "Hong Kong"]

      const nameIdx = Math.floor(random(i + 10) * names.length)
      const locIdx = Math.floor(random(i + 20) * locations.length)
      const opIdx = Math.floor(random(i + 30) * pool.openers.length)
      const midIdx = Math.floor(random(i + 40) * pool.middles.length)
      const clIdx = Math.floor(random(i + 50) * pool.closers.length)

      reviews.push({
        author: names[nameIdx],
        location: locations[locIdx],
        content: `${pool.openers[opIdx]} ${pool.middles[midIdx]} ${pool.closers[clIdx]}`,
        date: "Recent Acquisition",
        verified: true,
        rating: 5
      })
    }
  }

  return reviews
}