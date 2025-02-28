
import { Contact, Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createMessageActions = (
  contacts: Contact[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  activeConversation: Conversation | null,
  setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>,
) => {
  const { toast } = useToast();

  // Simple sentiment analysis to classify responses
  const classifyMessageSentiment = (content: string): 'positive' | 'negative' | 'neutral' => {
    const positiveKeywords = ['yes', 'interested', 'sure', 'thank', 'great', 'good', 'awesome', 'definitely', 'love to', 'would like', 'please'];
    const negativeKeywords = ['no', 'not interested', 'busy', 'stop', 'unsubscribe', 'don\'t', 'do not', 'never', 'waste', 'spam', 'remove'];
    
    const lowerContent = content.toLowerCase();
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    positiveKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) positiveScore++;
    });
    
    negativeKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword)) negativeScore++;
    });
    
    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  };

  // Extract keywords from message
  const extractKeywords = (content: string): string[] => {
    // This is a simplified keyword extraction
    // In a real app, you'd use a more sophisticated NLP approach
    const words = content.toLowerCase().split(/\W+/);
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that'];
    
    return words
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 5); // Return up to 5 keywords
  };

  const sendMessage = (contactId: string, messageBody: string, campaignId?: string) => {
    // Generate unique message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create new message with sentiment and keywords
    const newMessage: Message = {
      id: messageId,
      contactId,
      campaignId: campaignId || '1', // Default to first campaign if not specified
      content: messageBody,
      body: messageBody,
      sentAt: new Date(),
      status: 'sent',
      type: 'outbound',
      responseType: 'neutral', // Outbound messages don't have a response type
      keywords: extractKeywords(messageBody)
    };
    
    // Update conversations
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(c => c.contactId === contactId);
      
      if (conversationIndex !== -1) {
        // Update existing conversation
        updated[conversationIndex] = {
          ...updated[conversationIndex],
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.content,
          messages: [...(updated[conversationIndex].messages || []), newMessage]
        };
      } else {
        // Create new conversation
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
          updated.push({
            id: `conv-${Date.now()}`,
            contactId,
            contactName: contact.name,
            contactPhone: contact.phoneNumber,
            lastMessage: newMessage.content,
            lastMessageAt: newMessage.sentAt,
            lastMessagePreview: newMessage.content,
            status: 'new',
            unreadCount: 0,
            messages: [newMessage]
          });
        }
      }
      
      return updated;
    });
    
    // Update active conversation if needed
    if (activeConversation && activeConversation.contactId === contactId) {
      setActiveConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.content,
          messages: [...(prev.messages || []), newMessage]
        };
      });
    }
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully."
    });
  };

  const receiveMessage = (contactId: string, messageBody: string, campaignId?: string) => {
    // Generate unique message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Classify the response sentiment
    const responseType = classifyMessageSentiment(messageBody);
    
    // Extract keywords
    const keywords = extractKeywords(messageBody);
    
    // Create new message
    const newMessage: Message = {
      id: messageId,
      contactId,
      campaignId: campaignId || '1', // Default to first campaign if not specified
      content: messageBody,
      body: messageBody,
      sentAt: new Date(),
      status: 'received',
      type: 'inbound',
      responseType,
      keywords
    };
    
    // Update conversations
    setConversations(prev => {
      const updated = [...prev];
      const conversationIndex = updated.findIndex(c => c.contactId === contactId);
      
      if (conversationIndex !== -1) {
        // Update existing conversation
        let newStatus = updated[conversationIndex].status;
        
        // Update conversation status based on message sentiment
        if (responseType === 'positive') {
          newStatus = 'interested';
        } else if (responseType === 'negative') {
          newStatus = 'not-interested';
        }
        
        updated[conversationIndex] = {
          ...updated[conversationIndex],
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.content,
          status: newStatus,
          unreadCount: updated[conversationIndex].unreadCount + 1,
          messages: [...(updated[conversationIndex].messages || []), newMessage]
        };
      } else {
        // Create new conversation
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
          let status: Conversation['status'] = 'new';
          
          // Set initial status based on message sentiment
          if (responseType === 'positive') {
            status = 'interested';
          } else if (responseType === 'negative') {
            status = 'not-interested';
          }
          
          updated.push({
            id: `conv-${Date.now()}`,
            contactId,
            contactName: contact.name,
            contactPhone: contact.phoneNumber,
            lastMessage: newMessage.content,
            lastMessageAt: newMessage.sentAt,
            lastMessagePreview: newMessage.content,
            status,
            unreadCount: 1,
            messages: [newMessage]
          });
        }
      }
      
      return updated;
    });
    
    // Update active conversation if needed
    if (activeConversation && activeConversation.contactId === contactId) {
      setActiveConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          lastMessage: newMessage.content,
          lastMessageAt: newMessage.sentAt,
          lastMessagePreview: newMessage.content,
          unreadCount: prev.unreadCount + 1,
          messages: [...(prev.messages || []), newMessage]
        };
      });
    }
    
    toast({
      title: "New Message Received",
      description: `New message from ${contacts.find(c => c.id === contactId)?.name || 'Unknown'}`
    });
  };

  return {
    sendMessage,
    receiveMessage
  };
};
