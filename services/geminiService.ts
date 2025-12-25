
import { GoogleGenAI, Type } from "@google/genai";

export interface RealAuction {
  name: string;
  estimatedValue: number;
  house: string;
  url: string;
}

const FALLBACK_AUCTIONS: RealAuction[] = [
  { name: "1967 Ferrari 275 GTB/4", estimatedValue: 3200000, house: "RM Sotheby's", url: "https://www.rmsothebys.com" },
  { name: "Basquiat 'Untitled' (1982)", estimatedValue: 14500000, house: "Christie's", url: "https://www.christies.com" },
  { name: "Patek Philippe Nautilus 5711/1A", estimatedValue: 145000, house: "Phillips", url: "https://www.phillips.com" }
];

export const getTrendingAuctions = async (): Promise<{ auctions: RealAuction[], sources: any[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using internal knowledge instead of googleSearch for speed
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate 3 realistic, high-value auction listings that would be active right now in Art, Cars, or Watches. Return JSON with name, estimatedValue (number), house, and url.",
      config: {
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

    const text = response.text || '';
    
    // Robust JSON extraction
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    
    const data = JSON.parse(jsonMatch[0]);
    return { 
      auctions: data.auctions || FALLBACK_AUCTIONS, 
      sources: [] 
    };
  } catch (e) {
    console.error("Global Feed Error:", e);
    // Return fallback data so the feed is never empty
    return { auctions: FALLBACK_AUCTIONS, sources: [] };
  }
};

export const getBiddingStrategy = async (
  itemName: string,
  marketValue: number,
  personalValue: number,
  competitionLevel: string,
  simResults: { avgWinPrice: number; winRate: number; maxCompetitorBid: number }
): Promise<{ text: string; sources: any[]; structured: { openingBid: number, timing: string } }> => {
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
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
        
        Provide a detailed report including:
        1. EXACT RECOMMENDED OPENING BID: What amount should they start with?
        2. EXACT PARTICIPATION WINDOW: When and for how long?
        3. TACTICAL MANEUVER: e.g., 'Jump Bidding' or 'Silent Stalking'.
        4. FINAL VERDICT: Participate, Caution, or Abort.

        IMPORTANT: Use bold headings and clear bullet points for the UI.
      `,
    });

    return {
      text: response.text || "Strategy analysis unavailable. Proceed with caution.",
      sources: [],
      structured: {
        openingBid: Math.round(marketValue * 0.7),
        timing: "Strategic Sniping"
      }
    };
  } catch (error) {
    console.error("Strategy Error:", error);
    return {
      text: `**ANALYSIS FAILURE**\n\nNeural link disrupted. Fallback protocol engaged.\n\n* **Recommendation:** Bid conservatively.\n* **Limit:** Do not exceed $${personalValue}.\n* **Strategy:** Wait for market stabilization.`,
      sources: [],
      structured: {
        openingBid: Math.round(marketValue * 0.6),
        timing: "Immediate Entry"
      }
    };
  }
};
