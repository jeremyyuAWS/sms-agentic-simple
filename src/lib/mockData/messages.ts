
import { Message, Conversation } from '../types';
import { contacts } from './contacts';
import { campaigns } from './campaigns';
import { subDays, subHours, subMinutes } from 'date-fns';

// Generate more dynamic message data for richer demo
const generateMessages = () => {
  const now = new Date();
  let messageId = 1;
  let allMessages: Message[] = [];
  
  // Generate messages for each campaign
  campaigns.filter(c => c.status !== 'draft').forEach(campaign => {
    const campaignContacts = contacts.slice(0, campaign.contactCount || 3);
    const messageCount = campaign.messagesSent || Math.floor(Math.random() * 50) + 10;
    const responseRate = campaign.responseRate || Math.random() * 0.5;
    
    // Generate initial outbound messages
    campaignContacts.slice(0, messageCount).forEach((contact, idx) => {
      // Create outbound message
      const sentDate = subDays(now, Math.floor(Math.random() * 14));
      const outboundMsg: Message = {
        id: String(messageId++),
        contactId: contact.id,
        campaignId: campaign.id,
        content: `Hi ${contact.name}, this is a personalized message for our ${campaign.name} campaign.`,
        body: `Hi ${contact.name}, this is a personalized message for our ${campaign.name} campaign.`,
        sentAt: sentDate,
        status: 'delivered',
        type: 'outbound'
      };
      allMessages.push(outboundMsg);
      
      // Add responses based on response rate
      if (Math.random() < responseRate) {
        const responseTypes: Array<'positive' | 'negative' | 'neutral'> = ['positive', 'negative', 'neutral'];
        const responseType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
        const responseDelay = Math.floor(Math.random() * 120) + 10; // 10-130 minutes
        
        const responseContent = responseType === 'positive' 
          ? "Thanks for reaching out! I'd like to learn more about this."
          : responseType === 'negative'
            ? "Not interested at this time, please remove me from your list."
            : "Can you provide more information about what you're offering?";
        
        const inboundMsg: Message = {
          id: String(messageId++),
          contactId: contact.id,
          campaignId: campaign.id,
          content: responseContent,
          body: responseContent,
          sentAt: new Date(sentDate.getTime() + responseDelay * 60000),
          status: 'received',
          type: 'inbound',
          responseType: responseType
        };
        allMessages.push(inboundMsg);
        
        // Add follow-up for positive/neutral responses
        if (responseType !== 'negative' && Math.random() > 0.3) {
          const followUpDelay = Math.floor(Math.random() * 90) + 30; // 30-120 minutes
          const followUpContent = "Great! I'd be happy to share more details. How about a quick call next week?";
          
          const followUpMsg: Message = {
            id: String(messageId++),
            contactId: contact.id,
            campaignId: campaign.id,
            content: followUpContent,
            body: followUpContent,
            sentAt: new Date(inboundMsg.sentAt.getTime() + followUpDelay * 60000),
            status: 'delivered',
            type: 'outbound'
          };
          allMessages.push(followUpMsg);
        }
      }
    });
  });
  
  return allMessages;
};

// Generate all messages
export const messages: Message[] = generateMessages();

// Generate more dynamic conversations from messages
export const generateConversations = (messages: Message[]): Conversation[] => {
  const conversationsMap = new Map<string, Conversation>();
  
  // Group messages by contact
  messages.forEach(message => {
    const key = message.contactId;
    const contact = contacts.find(c => c.id === message.contactId);
    
    if (!contact) return;
    
    if (!conversationsMap.has(key)) {
      conversationsMap.set(key, {
        id: `conv-${key}`,
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phoneNumber,
        lastMessage: message.content,
        lastMessageAt: message.sentAt,
        lastMessagePreview: message.content.substring(0, 100),
        status: 'new',
        unreadCount: message.type === 'inbound' ? 1 : 0,
        messages: [message]
      });
    } else {
      const conversation = conversationsMap.get(key)!;
      conversation.messages.push(message);
      
      // Update last message info if this is newer
      if (message.sentAt > conversation.lastMessageAt) {
        conversation.lastMessage = message.content;
        conversation.lastMessageAt = message.sentAt;
        conversation.lastMessagePreview = message.content.substring(0, 100);
        
        // Update unread count for inbound messages
        if (message.type === 'inbound') {
          conversation.unreadCount += 1;
        }
      }
      
      // Update conversation status based on messages
      const hasPositive = conversation.messages.some(
        m => m.type === 'inbound' && m.responseType === 'positive'
      );
      const hasNegative = conversation.messages.some(
        m => m.type === 'inbound' && m.responseType === 'negative'
      );
      
      if (hasNegative) {
        conversation.status = 'do-not-disturb';
      } else if (hasPositive) {
        conversation.status = 'interested';
      } else if (conversation.messages.some(m => m.type === 'inbound')) {
        conversation.status = 'new';
      }
    }
  });
  
  return Array.from(conversationsMap.values());
};

export const conversations: Conversation[] = generateConversations(messages);
