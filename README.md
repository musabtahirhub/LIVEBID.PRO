# Game Theory: Auction House Simulator

An advanced economic simulation exploring English vs. Vickrey (Second-Price) auctions through AI-driven agents and batch simulations to demonstrate Strategy-Proofness and Nash Equilibrium.

## Features

- **Global Auction Feeds:** Uses the Gemini AI to ground simulated auctions in real-time or historically accurate market listings.
- **Monte Carlo Simulations:** Run batch simulations with randomized initial parameters to evaluate expected win probabilities and profitability across hundreds of scenarios.
- **AI-Powered Strategist:** Receive dynamic, generative AI bidding strategies and reports to navigate complex markets against synthetic competitors.
- **Agent Intel:** Profile competing bidders based on their calculated true values, risk aversion levels, and behavioral traits.
- **Auction Typologies:** Learn and experiment with different auction formats (English vs. Vickrey), exploring key microeconomic concepts like the Winner's Curse, dominant strategies, and revenue equivalence.

## Technologies Used

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **AI Integration:** `@google/genai` (Google Gemini API)

## Getting Started

1. Set up your environment variables:
   Ensure you have a `.env` file containing your valid `GEMINI_API_KEY`.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Educational Concepts Explored

- **Vickrey Auction (Second-Price Sealed-Bid):** Bidders submit written bids without knowing the bid of the other people in the auction. The highest bidder wins but pays the price submitted by the second-highest bidder. 
- **English Auction:** The most common form of auction. The auctioneer starts at a reserve price and participants bid progressively higher until no one is willing to offer more.
- **Nash Equilibrium:** A situation where no player can benefit by changing their strategy while the other players keep theirs unchanged.
- **Strategy-Proofness:** An environment where a participant's dominant strategy is to reveal their true, underlying preferences.

## License

This project is open-source and available for educational use.
