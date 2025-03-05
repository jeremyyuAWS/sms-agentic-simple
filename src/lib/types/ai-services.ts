
// AI Service Response Types
export interface MessageAnalysisResponse {
  sentiment: 'positive' | 'negative' | 'neutral';
  intent: 'interested' | 'not-interested' | 'needs-more-info' | 'ready-to-purchase' | 'question' | 'unknown';
  keyPhrases: string[];
  suggestedActions: string[];
  confidenceScore: number;
}

export interface MessageOptimizationResponse {
  originalMessage: string;
  optimizedMessage: string;
  improvements: {
    type: 'personalization' | 'clarity' | 'engagement' | 'length' | 'tone';
    description: string;
  }[];
  expectedEngagementIncrease: number;
}

export interface FollowUpSuggestionResponse {
  suggestions: {
    message: string;
    timing: {
      delayDays: number;
      bestTimeOfDay?: string;
    };
    expectedResponseRate: number;
    context: string;
  }[];
}

export interface CampaignInsightResponse {
  overallPerformance: {
    score: number;
    comparisonToSimilarCampaigns: number;
  };
  insights: {
    type: 'positive' | 'negative' | 'suggestion';
    message: string;
    impact: 'high' | 'medium' | 'low';
  }[];
  optimizationSuggestions: {
    area: 'message-content' | 'timing' | 'audience' | 'follow-up-sequence';
    suggestion: string;
    expectedImprovement: number;
  }[];
}
