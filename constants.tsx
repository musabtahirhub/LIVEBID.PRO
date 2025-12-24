
import { Bidder } from './types';

export const INITIAL_BIDDERS: Bidder[] = [
  {
    id: '1',
    name: 'Venture Victor',
    personality: 'Aggressive Growth',
    description: 'Bids high and fast, looking for dominance at any cost.',
    trueValueBase: 1200,
    riskAversion: 0.1
  },
  {
    id: '2',
    name: 'Cautious Clara',
    personality: 'Conservative Investor',
    description: 'Strictly adheres to budget. Rarely overbids.',
    trueValueBase: 950,
    riskAversion: 0.9
  },
  {
    id: '3',
    name: 'Mathematical Max',
    personality: 'Rational Optimizer',
    description: 'Attempts to find the Nash Equilibrium in every round.',
    trueValueBase: 1100,
    riskAversion: 0.5
  },
  {
    id: '4',
    name: 'Speculative Sam',
    personality: 'Wildcard Gambler',
    description: 'Value fluctuates wildly. Prone to irrational bidding.',
    trueValueBase: 1050,
    riskAversion: 0.3
  },
  {
    id: '5',
    name: 'Hedge Fund Harry',
    personality: 'Deep Pockets',
    description: 'Aims to price out competitors through sheer volume.',
    trueValueBase: 1300,
    riskAversion: 0.2
  }
];

export const SIMULATION_BATCH_SIZE = 1000;
