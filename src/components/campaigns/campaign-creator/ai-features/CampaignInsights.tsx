
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAiService } from '@/hooks/use-ai-service';
import { BarChart3, Sparkles, RotateCw, TrendingUp, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { CampaignInsightResponse } from '@/lib/types/ai-services';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CampaignInsightsProps {
  campaignData: any;
  onApplyOptimization?: (optimizationData: any) => void;
}

const CampaignInsights: React.FC<CampaignInsightsProps> = ({
  campaignData,
  onApplyOptimization
}) => {
  const [insights, setInsights] = useState<CampaignInsightResponse | null>(null);
  const { getCampaignInsights, isGettingInsights } = useAiService();
  
  useEffect(() => {
    // Auto-generate insights when component mounts
    handleGenerateInsights();
  }, []);
  
  const handleGenerateInsights = async () => {
    const result = await getCampaignInsights(campaignData);
    
    if (result) {
      setInsights(result);
    }
  };
  
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'message-content':
        return <Sparkles className="h-4 w-4" />;
      case 'timing':
        return <Clock className="h-4 w-4" />;
      case 'audience':
        return <Users className="h-4 w-4" />;
      case 'follow-up-sequence':
        return <ListOrdered className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">AI Campaign Insights</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateInsights}
          disabled={isGettingInsights}
        >
          {isGettingInsights ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>
      
      {isGettingInsights && (
        <div className="py-8 text-center">
          <RotateCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
          <p className="text-muted-foreground">Analyzing campaign performance...</p>
        </div>
      )}
      
      {insights && (
        <div className="space-y-6">
          {/* Performance Score */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Performance Overview</CardTitle>
              <CardDescription>
                Overall campaign effectiveness score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Score</span>
                <span className="text-2xl font-bold">{insights.overallPerformance.score}/100</span>
              </div>
              <Progress value={insights.overallPerformance.score} className="h-2.5 mb-4" />
              
              <div className="flex items-center justify-between text-sm">
                <span>Compared to similar campaigns:</span>
                <div className={`flex items-center ${
                  insights.overallPerformance.comparisonToSimilarCampaigns > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {insights.overallPerformance.comparisonToSimilarCampaigns > 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(insights.overallPerformance.comparisonToSimilarCampaigns).toFixed(1)}% 
                  {insights.overallPerformance.comparisonToSimilarCampaigns > 0 ? ' better' : ' worse'}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Key Insights */}
          <div>
            <h4 className="text-sm font-medium mb-2">Key Insights</h4>
            <div className="space-y-3">
              {insights.insights.map((insight, index) => (
                <div 
                  key={index}
                  className="flex items-start p-3 bg-slate-50 rounded-lg"
                >
                  <div className="mr-3 mt-0.5">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{insight.message}</p>
                    <div className="mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactBadgeClass(insight.impact)}`}>
                        {insight.impact} impact
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Optimization Suggestions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recommended Optimizations</h4>
            <div className="space-y-3">
              {insights.optimizationSuggestions.map((suggestion, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="border-l-4 border-indigo-500">
                    <CardContent className="p-4">
                      <div className="flex items-start">
                        <div className="bg-indigo-100 p-2 rounded mr-3">
                          {getAreaIcon(suggestion.area)}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-sm font-medium capitalize mb-1">{suggestion.area.replace('-', ' ')}</h5>
                          <p className="text-sm text-muted-foreground mb-2">{suggestion.suggestion}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                              +{suggestion.expectedImprovement}% improvement
                            </span>
                            
                            {onApplyOptimization && (
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!insights && !isGettingInsights && (
        <div className="text-center py-8 bg-slate-50 rounded-lg">
          <p className="text-muted-foreground">
            No insights available yet. Click "Generate Insights" to analyze this campaign.
          </p>
        </div>
      )}
    </div>
  );
};

// Add missing imports
import { Users, Clock, ListOrdered, Settings, TrendingDown } from 'lucide-react';

export default CampaignInsights;
