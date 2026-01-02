import type {
  CampaignsResponse,
  InsightsResponse,
  CampaignInsightsResponse
} from '../types/campaign';
import { API_BASE_URL } from '../utils/constant';

export const campaignApi = {
  getCampaigns: async (): Promise<CampaignsResponse> => {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    if (!response.ok) throw new Error('Failed to fetch campaigns');
    return response.json();
  },

  getAggregateInsights: async (): Promise<InsightsResponse> => {
    const response = await fetch(`${API_BASE_URL}/campaigns/insights`);
    if (!response.ok) throw new Error('Failed to fetch insights');
    return response.json();
  },

  getCampaignInsights: async (campaignId: string): Promise<CampaignInsightsResponse> => {
    const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/insights`);
    if (!response.ok) throw new Error('Failed to fetch campaign insights');
    return response.json();
  },

  streamCampaignInsights: (campaignId: string): EventSource => {
    return new EventSource(`${API_BASE_URL}/campaigns/${campaignId}/insights/stream`);
  }
};