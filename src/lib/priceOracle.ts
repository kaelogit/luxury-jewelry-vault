// Define the types for our market rates
export interface MarketRates {
  gold: number;   // Price per gram
  btc: number;    // Price per coin
  eth: number;    // Price per coin
}

export const fetchLiveMarketRates = async (): Promise<MarketRates> => {
  try {
    // In a real production app, you would use an API Key from GoldAPI.io or similar
    // For now, we fetch from a public ticker
    const goldResponse = await fetch('https://api.gold-api.com/price/XAU');
    const btcResponse = await fetch('https://api.coinbase.com/v2/prices/BTC-USD/spot');
    
    const goldData = await goldResponse.json();
    const btcData = await btcResponse.json();

    return {
      gold: goldData.price / 31.1035, // Convert Ounce to Gram
      btc: parseFloat(btcData.data.amount),
      eth: 2450.00 // Placeholder for ETH
    };
  } catch (error) {
    console.error("Oracle Failure:", error);
    return { gold: 75.50, btc: 65000, eth: 2400 }; // Fallback prices
  }
};

export const calculateSovereignPrice = (spot: number, weightGrams: number, premium: number) => {
  const baseValue = spot * weightGrams;
  const total = baseValue + (baseValue * (premium / 100));
  return total;
};