
import { useState } from 'react';
import { aiService } from '@/services/ai-service';
import { useToast } from '@/hooks/use-toast';

export const useAiService = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [isGettingInsights, setIsGettingInsights] = useState(false);

  // Analyze message sentiment and intent
  const analyzeMessage = async (message: string, context?: any) => {
    setIsAnalyzing(true);
    try {
      const result = await aiService.analyzeMessage(message, context);
      return result;
    } catch (error) {
      console.error('Error analyzing message:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze message. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Optimize message content
  const optimizeMessage = async (message: string, audience?: any) => {
    setIsOptimizing(true);
    try {
      const result = await aiService.optimizeMessage(message, audience);
      return result;
    } catch (error) {
      console.error('Error optimizing message:', error);
      toast({
        title: 'Optimization Error',
        description: 'Failed to optimize message. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsOptimizing(false);
    }
  };

  // Generate follow-up suggestions
  const generateFollowUpSuggestions = async (previousMessages: any[], campaignContext: any) => {
    setIsGeneratingSuggestions(true);
    try {
      const result = await aiService.generateFollowUpSuggestions(previousMessages, campaignContext);
      return result;
    } catch (error) {
      console.error('Error generating follow-up suggestions:', error);
      toast({
        title: 'Suggestion Error',
        description: 'Failed to generate follow-up suggestions. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // Get campaign insights
  const getCampaignInsights = async (campaignData: any) => {
    setIsGettingInsights(true);
    try {
      const result = await aiService.getCampaignInsights(campaignData);
      return result;
    } catch (error) {
      console.error('Error getting campaign insights:', error);
      toast({
        title: 'Insights Error',
        description: 'Failed to get campaign insights. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsGettingInsights(false);
    }
  };

  return {
    analyzeMessage,
    optimizeMessage,
    generateFollowUpSuggestions,
    getCampaignInsights,
    isAnalyzing,
    isOptimizing,
    isGeneratingSuggestions,
    isGettingInsights
  };
};
