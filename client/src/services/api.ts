import type {
  AuthResponse,
  AuctionFeedResponse,
  SimulationRequest,
  SimulationResponse,
  StrategyResponse,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get stored JWT token
 */
function getToken(): string | null {
  return localStorage.getItem('livebid_token');
}

/**
 * Core fetch wrapper with auth and error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * API client organized by resource
 */
export const api = {
  // ─── Auth ───────────────────────────────────────────────────
  auth: {
    async register(email: string, username: string, password: string): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      });
      localStorage.setItem('livebid_token', data.token);
      return data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
      const data = await request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('livebid_token', data.token);
      return data;
    },

    async me(): Promise<{ user: AuthResponse['user']; stats: any }> {
      return request('/auth/me');
    },

    logout(): void {
      localStorage.removeItem('livebid_token');
    },

    isAuthenticated(): boolean {
      return !!getToken();
    },
  },

  // ─── AI ─────────────────────────────────────────────────────
  ai: {
    async getFeed(): Promise<AuctionFeedResponse> {
      return request('/ai/feed', { method: 'POST' });
    },

    async getStrategy(
      itemName: string,
      marketValue: number,
      personalValue: number,
      competitionLevel: string,
      simResults: { avgWinPrice: number; winRate: number; maxCompetitorBid: number }
    ): Promise<StrategyResponse> {
      return request('/ai/strategy', {
        method: 'POST',
        body: JSON.stringify({
          itemName,
          marketValue,
          personalValue,
          competitionLevel,
          simResults,
        }),
      });
    },
  },

  // ─── Simulation ─────────────────────────────────────────────
  simulation: {
    async run(params: SimulationRequest): Promise<SimulationResponse> {
      return request('/simulate', {
        method: 'POST',
        body: JSON.stringify(params),
      });
    },

    async getHistory(): Promise<{ history: any[]; stats: any }> {
      return request('/simulate/history');
    },
  },

  // ─── Auctions ───────────────────────────────────────────────
  auctions: {
    async list(status?: string): Promise<{ auctions: any[]; total: number }> {
      const query = status ? `?status=${status}` : '';
      return request(`/auctions${query}`);
    },

    async get(id: number): Promise<any> {
      return request(`/auctions/${id}`);
    },

    async create(data: {
      name: string;
      description?: string;
      market_value: number;
      auction_type?: string;
      house?: string;
    }): Promise<any> {
      return request('/auctions', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    async placeBid(auctionId: number, amount: number): Promise<any> {
      return request(`/auctions/${auctionId}/bid`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
    },

    async close(auctionId: number): Promise<any> {
      return request(`/auctions/${auctionId}/close`, {
        method: 'PATCH',
      });
    },
  },

  // ─── Health ─────────────────────────────────────────────────
  async health(): Promise<any> {
    return request('/health');
  },
};
