import { Campaign, KnowledgeBase, FollowUp, FollowUpCondition, Message, TimeWindow, TemplateVariant, Template } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createCampaignActions = (
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>,
  setKnowledgeBases: React.Dispatch<React.SetStateAction<KnowledgeBase[]>>
) => {
  const { toast } = useToast();

  const createCampaign = (campaignData: Omit<Campaign, 'id' | 'createdAt'>) => {
    const now = new Date();
    const newCampaign: Campaign = {
      ...campaignData,
      id: `campaign-${Date.now()}`,
      createdAt: now,
      updatedAt: campaignData.updatedAt || now,
      followUps: campaignData.followUps || []
    };
    
    if (newCampaign.isABTest && newCampaign.templateVariants) {
      newCampaign.testStatus = 'not-started';
    }
    
    setCampaigns(prev => [...prev, newCampaign]);
    
    // If the campaign has a knowledge base, update the knowledge base's campaigns array
    if (newCampaign.knowledgeBaseId) {
      setKnowledgeBases(prev => prev.map(kb => {
        if (kb.id === newCampaign.knowledgeBaseId) {
          return {
            ...kb,
            campaigns: [...kb.campaigns, newCampaign.id]
          };
        }
        return kb;
      }));
    }
    
    toast({
      title: "Campaign Created",
      description: `Campaign "${newCampaign.name}" has been created successfully.`
    });
    
    return newCampaign;
  };
  
  const updateCampaign = (campaignId: string, updates: Partial<Omit<Campaign, 'id' | 'createdAt'>>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          ...updates,
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Campaign Updated",
      description: `Campaign has been updated successfully.`
    });
  };
  
  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    
    // If the campaign had a knowledge base, update the knowledge base's campaigns array
    setKnowledgeBases(prev => prev.map(kb => {
      if (kb.campaigns.includes(campaignId)) {
        return {
          ...kb,
          campaigns: kb.campaigns.filter(id => id !== campaignId)
        };
      }
      return kb;
    }));
    
    toast({
      title: "Campaign Deleted",
      description: "Campaign has been deleted successfully."
    });
  };
  
  const updateCampaignStatus = (campaignId: string, status: Campaign['status']) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        
        updated[campaignIndex] = {
          ...campaign,
          status,
          updatedAt: now,
          ...(status === 'active' && { 
            startedAt: now,
            ...(campaign.isABTest && { testStatus: 'in-progress' })
          }),
          ...(status === 'completed' && { 
            completedAt: now,
            ...(campaign.isABTest && campaign.testStatus === 'in-progress' && { testStatus: 'completed' })
          })
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Campaign Updated",
      description: `Campaign status has been updated to ${status}.`
    });
  };
  
  const addFollowUpToCampaign = (campaignId: string, followUp: Omit<FollowUp, 'id'>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        // Create a new follow-up with ID
        const newFollowUp: FollowUp = {
          ...followUp,
          id: `followup-${Date.now()}`
        };
        
        // Add to campaign's follow-ups array or create a new array
        const campaign = updated[campaignIndex];
        const followUps = campaign.followUps || [];
        
        updated[campaignIndex] = {
          ...campaign,
          followUps: [...followUps, newFollowUp],
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Added",
      description: `Follow-up message has been added to the campaign.`
    });
  };
  
  const updateFollowUp = (campaignId: string, followUpId: string, updates: Partial<Omit<FollowUp, 'id'>>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.followUps) {
          const updatedFollowUps = campaign.followUps.map(fu => 
            fu.id === followUpId ? { ...fu, ...updates } : fu
          );
          
          updated[campaignIndex] = {
            ...campaign,
            followUps: updatedFollowUps,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Updated",
      description: `Follow-up message has been updated.`
    });
  };
  
  const removeFollowUp = (campaignId: string, followUpId: string) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.followUps) {
          const filteredFollowUps = campaign.followUps.filter(fu => fu.id !== followUpId);
          
          updated[campaignIndex] = {
            ...campaign,
            followUps: filteredFollowUps,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Removed",
      description: `Follow-up message has been removed from the campaign.`
    });
  };
  
  const updateCampaignSchedule = (campaignId: string, scheduledStartDate: Date, timeZone?: string, sendingWindow?: TimeWindow) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          scheduledStartDate,
          timeZone: timeZone || updated[campaignIndex].timeZone,
          sendingWindow: sendingWindow || updated[campaignIndex].sendingWindow,
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    let description = `Campaign scheduled to start on ${scheduledStartDate.toLocaleString()}`;
    if (timeZone) {
      description += ` (${timeZone})`;
    }
    
    if (sendingWindow) {
      const daysOfWeek = sendingWindow.daysOfWeek.map(day => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[day];
      }).join(', ');
      
      description += ` between ${sendingWindow.startTime} and ${sendingWindow.endTime} on ${daysOfWeek}`;
    }
    
    toast({
      title: "Campaign Schedule Updated",
      description
    });
  };

  // New A/B testing functions

  const setupABTest = (campaignId: string, templateVariants: Omit<TemplateVariant, 'id'>[], testDuration: number, winnerSelectionCriteria: Campaign['winnerSelectionCriteria'] = 'response-rate') => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        // Create template variants with IDs
        const variantsWithIds = templateVariants.map(variant => ({
          ...variant,
          id: `variant-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }));
        
        // Update campaign with A/B test settings
        updated[campaignIndex] = {
          ...updated[campaignIndex],
          isABTest: true,
          templateVariants: variantsWithIds,
          testDuration,
          winnerSelectionCriteria,
          testStatus: 'not-started',
          updatedAt: now
        };
      }
      
      return updated;
    });
    
    toast({
      title: "A/B Test Setup",
      description: `A/B test has been set up with ${templateVariants.length} variants.`
    });
  };

  const updateTemplateVariant = (campaignId: string, variantId: string, updates: Partial<Omit<TemplateVariant, 'id'>>) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.templateVariants) {
          const updatedVariants = campaign.templateVariants.map(variant => 
            variant.id === variantId ? { ...variant, ...updates } : variant
          );
          
          updated[campaignIndex] = {
            ...campaign,
            templateVariants: updatedVariants,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
  };

  const removeTemplateVariant = (campaignId: string, variantId: string) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.templateVariants) {
          // Check if we're not trying to remove the last variant
          if (campaign.templateVariants.length <= 1) {
            toast({
              title: "Cannot Remove Variant",
              description: "A/B test must have at least one template variant.",
              variant: "destructive"
            });
            return prev;
          }
          
          const filteredVariants = campaign.templateVariants.filter(variant => variant.id !== variantId);
          
          // Recalculate percentages to ensure they still add up to 100%
          const totalRemainingPercentage = 100;
          const variantsCount = filteredVariants.length;
          const equalPercentage = totalRemainingPercentage / variantsCount;
          
          const rebalancedVariants = filteredVariants.map(variant => ({
            ...variant,
            contactPercentage: equalPercentage
          }));
          
          updated[campaignIndex] = {
            ...campaign,
            templateVariants: rebalancedVariants,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Variant Removed",
      description: "Template variant has been removed from the A/B test."
    });
  };

  const selectWinningVariant = (campaignId: string, variantId: string) => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.templateVariants) {
          // Find the winning variant
          const winningVariant = campaign.templateVariants.find(variant => variant.id === variantId);
          
          if (!winningVariant) {
            toast({
              title: "Error",
              description: "Selected variant not found.",
              variant: "destructive"
            });
            return prev;
          }
          
          // Mark the winning variant and update campaign
          const updatedVariants = campaign.templateVariants.map(variant => ({
            ...variant,
            isWinner: variant.id === variantId
          }));
          
          updated[campaignIndex] = {
            ...campaign,
            templateVariants: updatedVariants,
            testWinnerTemplateId: winningVariant.templateId,
            testStatus: 'completed',
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Winner Selected",
      description: "A winning template has been selected for this campaign."
    });
  };

  // Update template performance data based on message responses
  const updateABTestPerformance = (campaignId: string, variantId: string, stats: {
    messageCount?: number;
    responseCount?: number;
    positiveResponseCount?: number;
    negativeResponseCount?: number;
  }) => {
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.templateVariants) {
          const updatedVariants = campaign.templateVariants.map(variant => {
            if (variant.id === variantId) {
              const contactCount = stats.messageCount !== undefined 
                ? (variant.contactCount || 0) + stats.messageCount 
                : variant.contactCount;
              
              // Calculate response rates if we have message counts
              let responseRate = variant.responseRate;
              let positiveResponseRate = variant.positiveResponseRate;
              let negativeResponseRate = variant.negativeResponseRate;
              
              if (contactCount && contactCount > 0) {
                if (stats.responseCount !== undefined) {
                  responseRate = ((variant.responseRate || 0) * (variant.contactCount || 0) + stats.responseCount) / contactCount;
                }
                
                if (stats.positiveResponseCount !== undefined) {
                  positiveResponseRate = ((variant.positiveResponseRate || 0) * (variant.contactCount || 0) + stats.positiveResponseCount) / contactCount;
                }
                
                if (stats.negativeResponseCount !== undefined) {
                  negativeResponseRate = ((variant.negativeResponseRate || 0) * (variant.contactCount || 0) + stats.negativeResponseCount) / contactCount;
                }
              }
              
              return {
                ...variant,
                contactCount,
                responseRate,
                positiveResponseRate,
                negativeResponseRate
              };
            }
            return variant;
          });
          
          updated[campaignIndex] = {
            ...campaign,
            templateVariants: updatedVariants
          };
        }
      }
      
      return updated;
    });
  };

  // Auto-select winner based on criteria after test duration is over
  const autoSelectWinner = (campaignId: string) => {
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        
        // Only proceed if campaign is an A/B test and test is in progress
        if (campaign.isABTest && 
            campaign.testStatus === 'in-progress' && 
            campaign.templateVariants && 
            campaign.templateVariants.length > 0) {
          
          // Check if test duration has elapsed
          const testEndTime = new Date(campaign.startedAt || new Date());
          testEndTime.setHours(testEndTime.getHours() + (campaign.testDuration || 24));
          
          const now = new Date();
          if (now >= testEndTime) {
            // Sort variants based on selection criteria
            let sortedVariants = [...campaign.templateVariants];
            
            if (campaign.winnerSelectionCriteria === 'response-rate') {
              sortedVariants.sort((a, b) => (b.responseRate || 0) - (a.responseRate || 0));
            } else if (campaign.winnerSelectionCriteria === 'positive-response-rate') {
              sortedVariants.sort((a, b) => (b.positiveResponseRate || 0) - (a.positiveResponseRate || 0));
            } else {
              // If manual selection, don't auto-select
              return prev;
            }
            
            // Select the winner (first in sorted array)
            const winner = sortedVariants[0];
            
            // Mark as winner
            const updatedVariants = campaign.templateVariants.map(variant => ({
              ...variant,
              isWinner: variant.id === winner.id
            }));
            
            updated[campaignIndex] = {
              ...campaign,
              templateVariants: updatedVariants,
              testWinnerTemplateId: winner.templateId,
              testStatus: 'completed'
            };
            
            // Show toast about auto-selected winner
            toast({
              title: "A/B Test Completed",
              description: `Winner has been automatically selected based on ${campaign.winnerSelectionCriteria}.`
            });
          }
        }
      }
      
      return updated;
    });
  };

  // New function to check if a follow-up should be sent based on enhanced conditions
  const shouldSendFollowUp = (followUp: FollowUp, message: Message | null, lastResponseDate: Date | null): boolean => {
    // Legacy condition check
    if (followUp.condition) {
      if (followUp.condition === 'all') return true;
      if (followUp.condition === 'no-response' && !lastResponseDate) return true;
      return false;
    }
    
    // Enhanced conditions check
    if (followUp.conditions && followUp.conditions.length > 0) {
      return followUp.conditions.some(condition => {
        switch (condition.type) {
          case 'all':
            return true;
          case 'no-response':
            return !lastResponseDate;
          case 'positive-response':
            return message?.responseType === 'positive';
          case 'negative-response':
            return message?.responseType === 'negative';
          case 'keyword':
            if (!message || !condition.keywords || condition.keywords.length === 0) return false;
            return condition.keywords.some(keyword => 
              message.content.toLowerCase().includes(keyword.toLowerCase())
            );
          default:
            return false;
        }
      });
    }
    
    // Default to legacy behavior if no conditions specified
    return !lastResponseDate;
  };

  // Add a function to connect follow-ups into a workflow
  const connectFollowUps = (campaignId: string, sourceId: string, targetId: string, condition: 'onResponse' | 'onNoResponse') => {
    const now = new Date();
    
    setCampaigns(prev => {
      const updated = [...prev];
      const campaignIndex = updated.findIndex(c => c.id === campaignId);
      
      if (campaignIndex !== -1) {
        const campaign = updated[campaignIndex];
        if (campaign.followUps) {
          const updatedFollowUps = campaign.followUps.map(fu => {
            if (fu.id === sourceId) {
              return { 
                ...fu, 
                nextSteps: {
                  ...fu.nextSteps,
                  [condition]: targetId
                }
              };
            }
            return fu;
          });
          
          updated[campaignIndex] = {
            ...campaign,
            followUps: updatedFollowUps,
            updatedAt: now
          };
        }
      }
      
      return updated;
    });
    
    toast({
      title: "Follow-up Flow Updated",
      description: `Follow-up messages have been connected.`
    });
  };

  return {
    createCampaign,
    updateCampaign,
    deleteCampaign,
    updateCampaignStatus,
    addFollowUpToCampaign,
    updateFollowUp,
    removeFollowUp,
    updateCampaignSchedule,
    shouldSendFollowUp,
    connectFollowUps,
    // A/B testing
    setupABTest,
    updateTemplateVariant,
    removeTemplateVariant,
    selectWinningVariant,
    updateABTestPerformance,
    autoSelectWinner
  };
};
