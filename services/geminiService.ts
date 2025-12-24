
import { GoogleGenAI, Type } from "@google/genai";

export interface RealAuction {
  name: string;
  estimatedValue: number;
  house: string;
  url: string;
}

export const getTrendingAuctions = async (): Promise<{ auctions: RealAuction[], sources: any[] }> => {
  // Initialize AI instance right before usage to ensure current API_KEY is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "List 6 high-profile, currently active real-world auctions (Art, Classic Cars, or Collectibles). Provide the item name, estimated market value in USD, the auction house, and the direct URL. Focus on items ending soon.",
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          auctions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                estimatedValue: { type: Type.NUMBER },
                house: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ['name', 'estimatedValue', 'house', 'url']
            }
          }
        },
        required: ['auctions']
      }
    },
  });

  const text = response.text || '{"auctions": []}';
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  try {
    return { 
      auctions: JSON.parse(text).auctions, 
      sources 
    };
  } catch (e) {
    return { auctions: [], sources: [] };
  }
};

export const getBiddingStrategy = async (
  itemName: string,
  marketValue: number,
  personalValue: number,
  competitionLevel: string,
  simResults: { avgWinPrice: number; winRate: number; maxCompetitorBid: number }
): Promise<{ text: string; sources: any[]; structured: { openingBid: number, timing: string } }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Task: Act as a Senior Bidding Strategist for high-stakes auctions.
      Analyze this specific live auction opportunity: "${itemName}"
      
      Context:
      - Estimated Market Value: $${marketValue}
      - User's Max Ceiling (Limit): $${personalValue}
      - Competition Level: ${competitionLevel}
      
      Simulation Data:
      - Avg Historical/Simulated Win Price: $${simResults.avgWinPrice.toFixed(2)}
      - Success Probability at Ceiling: ${(simResults.winRate * 100).toFixed(1)}%
      
      Using Google Search, research recent comparable sales for this item.
      Then, provide a detailed report including:
      1. EXACT RECOMMENDED OPENING BID: What amount should they start with?
      2. EXACT PARTICIPATION WINDOW: When and for how long?
      3. TACTICAL MANEUVER: e.g., 'Jump Bidding' or 'Silent Stalking'.
      4. FINAL VERDICT: Participate, Caution, or Abort.

      IMPORTANT: Use bold headings and clear bullet points for the UI.
    `,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return {
    text: response.text || "Analysis unavailable.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    structured: {
      openingBid: Math.round(marketValue * 0.7),
      timing: "Strategic Sniping"
    }
  };
};
