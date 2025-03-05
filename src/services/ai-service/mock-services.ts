
import { 
  MessageAnalysisResponse, 
  MessageOptimizationResponse, 
  FollowUpSuggestionResponse,
  CampaignInsightResponse
} from '@/lib/types/ai-services';

// Sample positive phrases to detect
const POSITIVE_PHRASES = [
  'interested', 'sounds good', 'yes', 'sure', 'tell me more',
  'definitely', 'absolutely', 'please', 'thank you', 'great'
];

// Sample negative phrases to detect
const NEGATIVE_PHRASES = [
  'not interested', 'no thanks', 'stop', 'unsubscribe', 'busy',
  'no', 'don\'t', 'leave me alone', 'spam', 'go away'
];

/**
 * Mock function to analyze message sentiment and intent
 */
export const analyzeMessageMock = (message: string, context?: any): MessageAnalysisResponse => {
  const lowerMessage = message.toLowerCase();
  
  // Determine sentiment based on keywords
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let intent: MessageAnalysisResponse['intent'] = 'unknown';
  
  // Check for positive phrases
  if (POSITIVE_PHRASES.some(phrase => lowerMessage.includes(phrase))) {
    sentiment = 'positive';
    
    // Determine specific intent for positive responses
    if (lowerMessage.includes('tell me more') || lowerMessage.includes('more info')) {
      intent = 'needs-more-info';
    } else if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('get started')) {
      intent = 'ready-to-purchase';
    } else {
      intent = 'interested';
    }
  } 
  // Check for negative phrases
  else if (NEGATIVE_PHRASES.some(phrase => lowerMessage.includes(phrase))) {
    sentiment = 'negative';
    intent = 'not-interested';
  }
  // Check for questions
  else if (lowerMessage.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how') || 
          lowerMessage.startsWith('when') || lowerMessage.startsWith('who') || lowerMessage.startsWith('why')) {
    intent = 'question';
    // Questions can still be positive or neutral
    sentiment = POSITIVE_PHRASES.some(phrase => lowerMessage.includes(phrase)) ? 'positive' : 'neutral';
  }
  
  // Extract key phrases (simple implementation)
  const words = message.split(/\s+/);
  const keyPhrases = words
    .filter(word => word.length > 4) // Only longer words
    .slice(0, 3); // Take up to 3 key phrases
  
  // Generate suggested actions based on intent
  const suggestedActions: string[] = [];
  
  switch (intent) {
    case 'interested':
      suggestedActions.push('Send follow-up with more details');
      suggestedActions.push('Offer to schedule a call');
      break;
    case 'needs-more-info':
      suggestedActions.push('Send detailed product information');
      suggestedActions.push('Share case studies or testimonials');
      break;
    case 'ready-to-purchase':
      suggestedActions.push('Send direct purchase link');
      suggestedActions.push('Connect with sales team immediately');
      break;
    case 'question':
      suggestedActions.push('Provide specific answer to question');
      suggestedActions.push('Offer to connect with support team');
      break;
    case 'not-interested':
      suggestedActions.push('Remove from campaign');
      suggestedActions.push('Send one final value proposition in 7 days');
      break;
    default:
      suggestedActions.push('Wait 3 days and send follow-up message');
      suggestedActions.push('Try a different value proposition');
  }
  
  return {
    sentiment,
    intent,
    keyPhrases,
    suggestedActions,
    confidenceScore: Math.random() * 0.5 + 0.5 // Random score between 0.5 and 1
  };
};

/**
 * Mock function to optimize messages
 */
export const optimizeMessageMock = (message: string, audience?: any): MessageOptimizationResponse => {
  // Simple improvements based on message characteristics
  const improvements: MessageOptimizationResponse['improvements'] = [];
  
  // Check for personalization
  if (!message.includes('{name}') && !message.includes('{first_name}')) {
    improvements.push({
      type: 'personalization',
      description: 'Add recipient\'s name for higher engagement'
    });
  }
  
  // Check for length
  if (message.length > 160) {
    improvements.push({
      type: 'length',
      description: 'Message is too long - consider shortening to improve delivery rate'
    });
  } else if (message.length < 40) {
    improvements.push({
      type: 'length',
      description: 'Message is very short - add more context or value proposition'
    });
  }
  
  // Check for engagement elements
  if (!message.includes('?')) {
    improvements.push({
      type: 'engagement',
      description: 'Add a question to encourage response'
    });
  }
  
  // Create optimized message with improvements
  let optimizedMessage = message;
  
  if (improvements.some(i => i.type === 'personalization')) {
    optimizedMessage = `Hi {first_name}, ${optimizedMessage.charAt(0).toLowerCase() + optimizedMessage.slice(1)}`;
  }
  
  if (improvements.some(i => i.type === 'engagement') && !optimizedMessage.includes('?')) {
    optimizedMessage = optimizedMessage + ' Would you be interested in learning more?';
  }
  
  // Calculate expected engagement increase
  const expectedEngagementIncrease = improvements.length * 5; // 5% per improvement, simplified
  
  return {
    originalMessage: message,
    optimizedMessage,
    improvements,
    expectedEngagementIncrease
  };
};

/**
 * Mock function to generate follow-up suggestions
 */
export const generateFollowUpSuggestionsMock = (
  previousMessages: any[], 
  campaignContext: any
): FollowUpSuggestionResponse => {
  // Generate suggestions based on previous messages
  const suggestions = [];
  
  // Determine if there was a response
  const hasResponse = previousMessages.length > 1;
  const lastMessage = previousMessages[previousMessages.length - 1];
  
  // If this is the first follow-up after initial message
  if (previousMessages.length === 1) {
    suggestions.push({
      message: "I wanted to follow up on my previous message. Would you have time for a quick chat this week?",
      timing: {
        delayDays: 3,
        bestTimeOfDay: "10:00 AM"
      },
      expectedResponseRate: 0.25,
      context: "Initial follow-up to non-responsive contact"
    });
    
    suggestions.push({
      message: "I thought you might be interested in this case study about how we helped a similar company increase their efficiency by 30%. Would you like to see how we did it?",
      timing: {
        delayDays: 4,
        bestTimeOfDay: "2:00 PM"
      },
      expectedResponseRate: 0.28,
      context: "Value-driven follow-up with social proof"
    });
  }
  // If there was a positive response
  else if (hasResponse && lastMessage.type === 'inbound' && 
          POSITIVE_PHRASES.some(phrase => lastMessage.content.toLowerCase().includes(phrase))) {
    suggestions.push({
      message: "Great! I'd love to discuss how we can help you achieve your goals. Would you prefer a phone call or a short demo?",
      timing: {
        delayDays: 1,
        bestTimeOfDay: "11:00 AM"
      },
      expectedResponseRate: 0.65,
      context: "Prompt follow-up to interested contact"
    });
    
    suggestions.push({
      message: "Excellent! Here's a link to schedule a quick call at your convenience: [Calendar Link]. Looking forward to chatting!",
      timing: {
        delayDays: 0,
        bestTimeOfDay: "ASAP"
      },
      expectedResponseRate: 0.72,
      context: "Immediate scheduling opportunity"
    });
  }
  // If there was a negative response
  else if (hasResponse && lastMessage.type === 'inbound' && 
          NEGATIVE_PHRASES.some(phrase => lastMessage.content.toLowerCase().includes(phrase))) {
    suggestions.push({
      message: "I understand this might not be the right time. Would it be okay if I check back in a month when you might have more bandwidth?",
      timing: {
        delayDays: 2,
        bestTimeOfDay: "3:00 PM"
      },
      expectedResponseRate: 0.15,
      context: "Respectful acknowledgment of disinterest"
    });
    
    suggestions.push({
      message: "No problem at all. If you ever need our services in the future, feel free to reach out. Have a great day!",
      timing: {
        delayDays: 1,
        bestTimeOfDay: "10:00 AM"
      },
      expectedResponseRate: 0.10,
      context: "Final positive touchpoint"
    });
  }
  // If there was a neutral or question response
  else {
    suggestions.push({
      message: "To answer your question - we've helped over 100 companies improve their process efficiency by an average of 27%. Would you like me to share some specific examples relevant to your industry?",
      timing: {
        delayDays: 1,
        bestTimeOfDay: "1:00 PM"
      },
      expectedResponseRate: 0.45,
      context: "Informative response with specific data points"
    });
    
    suggestions.push({
      message: "I'd be happy to provide more information. Could you let me know which aspect of our solution you're most interested in?",
      timing: {
        delayDays: 1,
        bestTimeOfDay: "11:00 AM"
      },
      expectedResponseRate: 0.40,
      context: "Engaging question to continue conversation"
    });
  }
  
  return { suggestions };
};

/**
 * Mock function to generate campaign insights
 */
export const getCampaignInsightsMock = (campaignData: any): CampaignInsightResponse => {
  // Generate insights based on campaign data
  const responseRate = (campaignData.messagesSent && campaignData.responseCount) 
    ? campaignData.responseCount / campaignData.messagesSent 
    : Math.random() * 0.3; // Random response rate between 0-30%
  
  const insights = [];
  const optimizationSuggestions = [];
  
  // Generate performance score (0-100)
  const score = Math.round(responseRate * 100 + Math.random() * 20);
  
  // Compare to "similar" campaigns
  const comparisonToSimilarCampaigns = (Math.random() * 40) - 20; // Random between -20% and +20%
  
  // Generate insights based on response rate
  if (responseRate > 0.25) {
    insights.push({
      type: 'positive',
      message: `Your response rate of ${(responseRate * 100).toFixed(1)}% is above average for this type of campaign.`,
      impact: 'high'
    });
  } else {
    insights.push({
      type: 'negative',
      message: `Your response rate of ${(responseRate * 100).toFixed(1)}% is below the industry average of 25%.`,
      impact: 'high'
    });
    
    optimizationSuggestions.push({
      area: 'message-content',
      suggestion: 'Your initial messages are quite lengthy. Consider shortening them to 100 characters or less for higher engagement.',
      expectedImprovement: 15
    });
  }
  
  // Add time-based insight
  insights.push({
    type: 'suggestion',
    message: 'Messages sent between 10am-2pm have 22% higher response rates than those sent outside business hours.',
    impact: 'medium'
  });
  
  optimizationSuggestions.push({
    area: 'timing',
    suggestion: 'Schedule your messages on Tuesday-Thursday mornings for optimal engagement.',
    expectedImprovement: 12
  });
  
  optimizationSuggestions.push({
    area: 'follow-up-sequence',
    suggestion: 'Add a third follow-up message for non-responsive contacts with a different value proposition.',
    expectedImprovement: 8
  });
  
  if (!campaignData.isABTest) {
    optimizationSuggestions.push({
      area: 'message-content',
      suggestion: 'Enable A/B testing with at least two message variations to optimize engagement.',
      expectedImprovement: 18
    });
  }
  
  return {
    overallPerformance: {
      score,
      comparisonToSimilarCampaigns
    },
    insights,
    optimizationSuggestions
  };
};
