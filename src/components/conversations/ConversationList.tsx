
import React, { useState } from 'react';
import { Conversation } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import {
  MessageSquare, 
  User, 
  Clock, 
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bell,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface ConversationListProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
  selectedId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  onSelect,
  selectedId
}) => {
  const [filter, setFilter] = useState<Conversation['status'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredConversations = conversations.filter(conversation => {
    // Apply status filter
    if (filter !== 'all' && conversation.status !== filter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        conversation.contactName.toLowerCase().includes(query) ||
        conversation.contactPhone.toLowerCase().includes(query) ||
        conversation.lastMessagePreview.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  const getStatusIcon = (status: Conversation['status']) => {
    switch (status) {
      case 'interested':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'do-not-disturb':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'no-response':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'active':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New' },
    { value: 'active', label: 'Active' },
    { value: 'interested', label: 'Interested' },
    { value: 'no-response', label: 'No Response' },
    { value: 'do-not-disturb', label: 'Do Not Disturb' }
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Search contacts or messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filterButtons.map((btn) => (
          <Button
            key={btn.value}
            variant={filter === btn.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(btn.value as any)}
            className="transition-all duration-300"
          >
            {btn.label}
          </Button>
        ))}
      </div>
      
      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <AnimatedCard className="py-8 text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No conversations found</p>
          </AnimatedCard>
        ) : (
          filteredConversations.map((conversation, index) => (
            <AnimatedCard
              key={conversation.id}
              className={cn(
                "cursor-pointer transition-all duration-300",
                selectedId === conversation.id && "border-primary/30 bg-primary/5"
              )}
              animationDelay={index * 50}
              onClick={() => onSelect(conversation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{conversation.contactName}</h3>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(conversation.status)}
                        <span className="text-xs text-muted-foreground capitalize">
                          {conversation.status.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {conversation.contactPhone}
                    </p>
                    
                    <p className="text-sm mt-2 line-clamp-1">
                      {conversation.lastMessagePreview}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(conversation.lastMessageAt, { addSuffix: true })}
                  </span>
                  
                  {conversation.unreadCount > 0 && (
                    <div className="flex items-center mt-1">
                      <span className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationList;
