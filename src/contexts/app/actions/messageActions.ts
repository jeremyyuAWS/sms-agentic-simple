
import { Contact, Conversation, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createMessageActions = (
  contacts: Contact[],
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>,
  activeConversation: Conversation | null,
  setActiveConversation: React.Dispatch<React.SetStateAction<Conversation | null>>,
) => {
  const { toast } = useToast();

  const sendMessage = (contactId: string, messageBody: string, campaignId?: string) => {
    // Generate unique message ID
    const messageId = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Create new message
    const newMessage: Message = {
      id: messageId,
      contactId,
      campaignId: campaignId || '1', // Default to first campaign if not specified
      content: messageBody,
      body: messageBody,
      sentAt: new Date(),
      status: 'sent',
      type: 'outbound'
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

  return {
    sendMessage
  };
};
