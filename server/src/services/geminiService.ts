import { GoogleGenAI, Type } from '@google/genai';

export interface RealAuction {
  name: string;
  estimatedValue: number;
  house: string;
  url: string;
}

const FALLBACK_AUCTIONS: RealAuction[] = [
  { name: "1967 Ferrari 275 GTB/4", estimatedValue: 3200000, house: "RM Sotheby's", url: "https://www.rmsothebys.com" },
  { name: "Basquiat 'Untitled' (1982)", estimatedValue: 14500000, house: "Christie's", url: "https://www.christies.com" },
  { name: "Patek Philippe Nautilus 5711/1A", estimatedValue: 145000, house: "Phillips", url: "https://www.phillips.com" },
  { name: "1962 Shelby Cobra 260", estimatedValue: 2400000, house: "Bonhams", url: "https://www.bonhams.com" },
  { name: "Banksy 'Girl with Balloon' (2006)", estimatedValue: 1800000, house: "Sotheby's", url: "https://www.sothebys.com" },
  { name: "Rolex Daytona 'Paul Newman' Ref. 6239", estimatedValue: 450000, house: "Christie's", url: "https://www.christies.com" },
];

function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function getTrendingAuctions(): Promise<{ auctions: RealAuction[]; sources: any[] }> {
  try {
    const ai = getAI();
    if (!ai) {
      console.log('[AI] No API key configured, using fallback auctions');
      return { auctions: FALLBACK_AUCTIONS, sources: [] };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: 'Generate 6 realistic, high-value auction listings that would be active right now across Art, Classic Cars, Luxury Watches, and Rare Collectibles. Return JSON with name, estimatedValue (number), house, and url.',
      config: {
        responseMimeType: 'application/json',
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
                  url: { type: Type.STRING },
                },
                required: ['name', 'estimatedValue', 'house', 'url'],
              },
            },
          },
          required: ['auctions'],
        },
      },
    });

    const text = response.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in response');

    const data = JSON.parse(jsonMatch[0]);
    return {
      auctions: data.auctions || FALLBACK_AUCTIONS,
      sources: [],
    };
  } catch (e) {
    console.error('[AI] Global Feed Error:', e);
    return { auctions: FALLBACK_AUCTIONS, sources: [] };
  }
}

export async function getBiddingStrategy(
  itemName: string,
  marketValue: number,
  personalValue: number,
  competitionLevel: string,
  simResults: { avgWinPrice: number; winRate: number; maxCompetitorBid: number }
): Promise<{ text: string; sources: any[]; structured: { openingBid: number; timing: string } }> {
  try {
    const ai = getAI();
    if (!ai) {
      return {
        text: `**STRATEGIC BRIEFING — ${itemName}**\n\n*AI service unavailable. Configure GEMINI_API_KEY for live analysis.*\n\n**Simulation Data:**\n- Win Rate: ${(simResults.winRate * 100).toFixed(1)}%\n- Avg Win Price: $${simResults.avgWinPrice.toFixed(0)}\n- Max Competitor Bid: $${simResults.maxCompetitorBid.toFixed(0)}\n\n**Recommendation:** Bid conservatively. Do not exceed $${personalValue}.`,
        sources: [],
        structured: { openingBid: Math.round(marketValue * 0.7), timing: 'Strategic Sniping' },
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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
      text: response.text || 'Strategy analysis unavailable. Proceed with caution.',
      sources: [],
      structured: {
        openingBid: Math.round(marketValue * 0.7),
        timing: 'Strategic Sniping',
      },
    };
  } catch (error) {
    console.error('[AI] Strategy Error:', error);
    return {
      text: `**ANALYSIS FAILURE**\n\nNeural link disrupted. Fallback protocol engaged.\n\n* **Recommendation:** Bid conservatively.\n* **Limit:** Do not exceed $${personalValue}.\n* **Strategy:** Wait for market stabilization.`,
      sources: [],
      structured: {
        openingBid: Math.round(marketValue * 0.6),
        timing: 'Immediate Entry',
      },
    };
  }
}
