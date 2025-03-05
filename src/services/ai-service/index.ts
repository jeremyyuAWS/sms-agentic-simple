
import { 
  MessageAnalysisResponse, 
  MessageOptimizationResponse, 
  FollowUpSuggestionResponse,
  CampaignInsightResponse
} from '@/lib/types/ai-services';

// Importing our mock services (will be replaced with real API calls later)
import { 
  analyzeMessageMock, 
  optimizeMessageMock, 
  generateFollowUpSuggestionsMock,
  getCampaignInsightsMock
} from './mock-services';

// Flag to switch between mock and real services
const USE_REAL_SERVICES = false;

// Endpoint configuration (to be replaced with real Lyzr endpoints)
const API_ENDPOINTS = {
  messageAnalysis: '/api/message-analysis',
  messageOptimization: '/api/message-optimization',
  followUpSuggestions: '/api/follow-up-suggestions',
  campaignInsights: '/api/campaign-insights'
};

// Service functions
export const aiService = {
  /**
   * Analyzes a message for sentiment, intent, and key phrases
   */
  analyzeMessage: async (message: string, context?: any): Promise<MessageAnalysisResponse> => {
    if (USE_REAL_SERVICES) {
      // Real API call to Lyzr endpoint
      const response = await fetch(API_ENDPOINTS.messageAnalysis, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, context }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze message');
      }
      
      return await response.json();
    } else {
      // Use mock service
      return analyzeMessageMock(message, context);
    }
  },
  
  /**
   * Optimizes a message to improve engagement
   */
  optimizeMessage: async (message: string, audience?: any): Promise<MessageOptimizationResponse> => {
    if (USE_REAL_SERVICES) {
      // Real API call to Lyzr endpoint
      const response = await fetch(API_ENDPOINTS.messageOptimization, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, audience }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to optimize message');
      }
      
      return await response.json();
    } else {
      // Use mock service
      return optimizeMessageMock(message, audience);
    }
  },
  
  /**
   * Generates follow-up suggestions based on previous messages and responses
   */
  generateFollowUpSuggestions: async (
    previousMessages: any[], 
    campaignContext: any
  ): Promise<FollowUpSuggestionResponse> => {
    if (USE_REAL_SERVICES) {
      // Real API call to Lyzr endpoint
      const response = await fetch(API_ENDPOINTS.followUpSuggestions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ previousMessages, campaignContext }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate follow-up suggestions');
      }
      
      return await response.json();
    } else {
      // Use mock service
      return generateFollowUpSuggestionsMock(previousMessages, campaignContext);
    }
  },
  
  /**
   * Gets insights for a campaign to improve performance
   */
  getCampaignInsights: async (campaignData: any): Promise<CampaignInsightResponse> => {
    if (USE_REAL_SERVICES) {
      // Real API call to Lyzr endpoint
      const response = await fetch(API_ENDPOINTS.campaignInsights, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignData }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get campaign insights');
      }
      
      return await response.json();
    } else {
      // Use mock service
      return getCampaignInsightsMock(campaignData);
    }
  }
};
