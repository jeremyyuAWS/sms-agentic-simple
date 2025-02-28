
import { useState, useMemo } from 'react';
import { Campaign } from '@/lib/types';

type StatusFilter = 'all' | 'active' | 'draft' | 'paused' | 'completed';
type SortOption = 'newest' | 'oldest' | 'response' | 'contacts';

export const useCampaignFilters = (campaigns: Campaign[]) => {
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort campaigns
  const filteredCampaigns = useMemo(() => {
    // First filter by status
    let filtered = campaigns;
    
    if (activeStatus !== 'all') {
      filtered = filtered.filter(c => {
        if (activeStatus === 'completed') return c.status === 'completed';
        if (activeStatus === 'paused') return c.status === 'paused';
        return c.status === activeStatus;
      });
    }
    
    // Then filter by search query if present
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        c => c.name.toLowerCase().includes(query) || 
             (c.description && c.description.toLowerCase().includes(query))
      );
    }
    
    // Then sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'response':
          return (b.responseRate || 0) - (a.responseRate || 0);
        case 'contacts':
          return (b.contactCount || 0) - (a.contactCount || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [campaigns, activeStatus, sortBy, searchQuery]);

  // Get counts by status for display in filters
  const statusCounts = useMemo(() => {
    const counts = {
      all: campaigns.length,
      active: 0,
      draft: 0,
      paused: 0,
      completed: 0
    };
    
    campaigns.forEach(campaign => {
      counts[campaign.status] = (counts[campaign.status as keyof typeof counts] || 0) + 1;
    });
    
    return counts;
  }, [campaigns]);

  return {
    activeStatus,
    sortBy,
    searchQuery,
    filteredCampaigns,
    statusCounts,
    setActiveStatus,
    setSortBy,
    setSearchQuery,
  };
};
