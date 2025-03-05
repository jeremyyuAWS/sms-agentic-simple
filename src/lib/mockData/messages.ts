import { Message, Conversation } from '../types';
import { contacts } from './contacts';
import { campaigns } from './campaigns';
import { subDays, subHours, subMinutes, addHours, addDays } from 'date-fns';

// Generate more dynamic message data for richer demo
const generateMessages = () => {
  const now = new Date();
  let messageId = 1;
  let allMessages: Message[] = [];
  
  // Generate messages for each campaign
  campaigns.filter(c => c.status !== 'draft').forEach(campaign => {
    // Determine if the campaign is completed to generate a comprehensive history
    const isCompleted = campaign.status === 'completed';
    
    // For completed campaigns, generate a full set of messages over the campaign duration
    const campaignContacts = contacts.slice(0, campaign.contactCount || 3);
    const messageDensity = isCompleted ? 0.95 : 0.4; // Much higher density for completed campaigns
    
    // Calculate the number of messages to generate based on contact count
    // Many more messages for completed campaigns
    const contactsToUse = Math.min(campaign.contactCount || 3, 100);
    const messageCount = isCompleted 
      ? Math.floor(contactsToUse * messageDensity * 4.5) // Generate 4.5x more messages for completed campaigns
      : Math.floor(contactsToUse * messageDensity * 1.2);
    
    // Calculate campaign duration for message spread
    const campaignStartDate = campaign.startedAt || subDays(now, isCompleted ? 30 : 14);
    const campaignEndDate = campaign.completedAt || now;
    const campaignDurationDays = Math.max(
      1, 
      Math.ceil((campaignEndDate.getTime() - campaignStartDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    
    // Define time of day distribution patterns for more realistic data
    // This creates "hot spots" during business hours
    const timeOfDayDistribution = [
      { hours: [0, 1, 2, 3, 4], weight: 0.05 },  // Early morning (very low)
      { hours: [5, 6, 7], weight: 0.15 },        // Early morning (low)
      { hours: [8, 9], weight: 0.8 },            // Morning start (high)
      { hours: [10, 11], weight: 1.0 },          // Late morning (peak)
      { hours: [12, 13], weight: 0.6 },          // Lunch (medium)
      { hours: [14, 15, 16], weight: 0.9 },      // Afternoon (high)
      { hours: [17, 18], weight: 0.5 },          // Evening (medium)
      { hours: [19, 20, 21], weight: 0.3 },      // Late evening (low)
      { hours: [22, 23], weight: 0.1 }           // Night (very low)
    ];
    
    // Define day of week patterns for more realistic data
    // This weights weekdays higher than weekends
    const dayOfWeekDistribution = [
      { day: 0, name: 'Sunday', weight: 0.2 },    // Weekend (low)
      { day: 1, name: 'Monday', weight: 0.85 },   // Weekday (high) - people catching up
      { day: 2, name: 'Tuesday', weight: 1.0 },   // Weekday (peak)
      { day: 3, name: 'Wednesday', weight: 0.95 }, // Weekday (high)
      { day: 4, name: 'Thursday', weight: 0.9 },  // Weekday (high)
      { day: 5, name: 'Friday', weight: 0.7 },    // Weekday (medium) - winding down
      { day: 6, name: 'Saturday', weight: 0.15 }  // Weekend (low)
    ];
    
    // Generate a more realistic distribution of messages over campaign duration
    for (let i = 0; i < messageCount; i++) {
      // Select a contact (cycling through available contacts)
      const contact = campaignContacts[i % campaignContacts.length];
      
      // For completed campaigns, distribute messages throughout the campaign duration
      // For active campaigns, concentrate more messages in recent days
      let dayOffset: number;
      if (isCompleted) {
        // Generate more varied distribution for completed campaigns
        if (i < messageCount * 0.3) {
          // First 30% of messages more dense at the beginning (first third of campaign)
          dayOffset = Math.floor((i / (messageCount * 0.3)) * (campaignDurationDays / 3));
        } else if (i < messageCount * 0.7) {
          // Middle 40% distributed through the middle
          dayOffset = Math.floor(campaignDurationDays / 3 + ((i - messageCount * 0.3) / (messageCount * 0.4)) * (campaignDurationDays / 3));
        } else {
          // Last 30% distributed through the final third
          dayOffset = Math.floor(2 * campaignDurationDays / 3 + ((i - messageCount * 0.7) / (messageCount * 0.3)) * (campaignDurationDays / 3));
        }
      } else {
        // More recent messages for active campaigns (logarithmic distribution)
        dayOffset = Math.floor(Math.log(1 + (i / messageCount) * 10) / Math.log(11) * campaignDurationDays);
      }
      
      // Calculate message date based on campaign timeline
      const messageDate = new Date(campaignStartDate);
      messageDate.setDate(messageDate.getDate() + dayOffset);
      
      // Use weighted random selection for day of week (for completed campaigns only)
      if (isCompleted && campaignDurationDays > 7) {
        // Only adjust day of week if we have enough campaign duration to play with
        const currentDayOfWeek = messageDate.getDay();
        
        // Calculate how far we could shift the date in either direction without going outside campaign bounds
        const maxShiftBackward = Math.min(dayOffset, 6); // Maximum 6 days back
        const maxShiftForward = Math.min(campaignDurationDays - dayOffset - 1, 6); // Maximum 6 days forward
        
        // Try to find a better day of week using weighted random selection
        const attemptDayAdjustment = Math.random() < 0.8; // 80% chance to optimize day of week
        
        if (attemptDayAdjustment) {
          // Get weights for all possible days we could shift to
          const possibleDays = [];
          
          for (let shift = -maxShiftBackward; shift <= maxShiftForward; shift++) {
            if (shift === 0) continue; // Skip current day, it's already counted
            
            const newDate = new Date(messageDate);
            newDate.setDate(newDate.getDate() + shift);
            const newDayOfWeek = newDate.getDay();
            
            possibleDays.push({
              shift,
              weight: dayOfWeekDistribution[newDayOfWeek].weight
            });
          }
          
          // Sort by weight (descending) to prioritize higher weighted days
          possibleDays.sort((a, b) => b.weight - a.weight);
          
          // 70% chance to pick from top 3 days (if we have that many options)
          if (possibleDays.length > 0) {
            const useTopDay = Math.random() < 0.7;
            const selectedShift = useTopDay 
              ? possibleDays[Math.floor(Math.random() * Math.min(3, possibleDays.length))].shift
              : possibleDays[Math.floor(Math.random() * possibleDays.length)].shift;
            
            messageDate.setDate(messageDate.getDate() + selectedShift);
          }
        }
      }
      
      // Distribute time of day (weighted random) based on business hours for better realism
      // Select a random hour with weighted probability favoring business hours
      let hourBucket: number[];
      
      // Get total weight for normalization
      const totalWeight = timeOfDayDistribution.reduce((sum, bucket) => sum + bucket.weight, 0);
      
      // Select a random weighted bucket
      let random = Math.random() * totalWeight;
      let accumulatedWeight = 0;
      
      for (let bucket of timeOfDayDistribution) {
        accumulatedWeight += bucket.weight;
        if (random <= accumulatedWeight) {
          hourBucket = bucket.hours;
          break;
        }
      }
      
      if (!hourBucket) {
        hourBucket = timeOfDayDistribution[4].hours; // Default to midday if something went wrong
      }
      
      // Select a random hour from the chosen bucket
      const hour = hourBucket[Math.floor(Math.random() * hourBucket.length)];
      
      // Set the hour and add random minutes
      messageDate.setHours(hour);
      messageDate.setMinutes(Math.floor(Math.random() * 60));
      
      // Create outbound message
      const outboundMsg: Message = {
        id: String(messageId++),
        contactId: contact.id,
        campaignId: campaign.id,
        content: `Hi ${contact.name}, ${isCompleted ? 'thank you for your interest in' : 'I wanted to reach out about'} our ${campaign.name} campaign. ${Math.random() > 0.5 ? 'Would you be interested in learning more?' : 'Do you have time to discuss this further?'}`,
        body: `Hi ${contact.name}, ${isCompleted ? 'thank you for your interest in' : 'I wanted to reach out about'} our ${campaign.name} campaign. ${Math.random() > 0.5 ? 'Would you be interested in learning more?' : 'Do you have time to discuss this further?'}`,
        sentAt: messageDate,
        status: 'delivered',
        type: 'outbound'
      };
      allMessages.push(outboundMsg);
      
      // Determine response probability based on campaign's response rate
      // Higher response rates for completed campaigns
      const baseResponseRate = campaign.responseRate || 0.3;
      const responseRate = isCompleted ? Math.min(0.85, baseResponseRate * (1.5 + (dayOffset / campaignDurationDays) * 0.5)) : baseResponseRate;
      const willRespond = Math.random() < responseRate;
      
      if (willRespond) {
        // Add some realism with response delay
        const responseDelayMinutes = Math.floor(Math.random() * 180) + 10; // 10 min to 3 hours
        const responseDate = new Date(messageDate.getTime() + responseDelayMinutes * 60 * 1000);
        
        // Distribution of response types varies by campaign type and progression
        // Completed campaigns have more positive responses, especially toward the end
        let responseTypeChances: Record<string, number>;
        
        if (isCompleted) {
          // For completed campaigns, increase positive responses as campaign progresses
          const campaignProgress = dayOffset / campaignDurationDays;
          const positiveChance = 0.45 + (campaignProgress * 0.3); // 45-75% positive, increasing over time
          const negativeChance = 0.35 - (campaignProgress * 0.25); // 10-35% negative, decreasing over time
          const neutralChance = 1 - positiveChance - negativeChance; // 15-20% neutral
          
          responseTypeChances = { 
            positive: positiveChance, 
            negative: negativeChance, 
            neutral: neutralChance 
          };
        } else {
          responseTypeChances = { positive: 0.5, negative: 0.3, neutral: 0.2 };
        }
        
        // Determine response type based on probabilities
        let responseType: 'positive' | 'negative' | 'neutral';
        const rand = Math.random();
        
        if (rand < responseTypeChances.positive) {
          responseType = 'positive';
        } else if (rand < responseTypeChances.positive + responseTypeChances.negative) {
          responseType = 'negative';
        } else {
          responseType = 'neutral';
        }
        
        // Create response content based on type
        let responseContent = '';
        switch (responseType) {
          case 'positive':
            responseContent = Math.random() > 0.5 
              ? `Thanks for reaching out! I'm definitely interested in learning more about ${campaign.name}.`
              : `This sounds interesting! I'd love to discuss this further. When would be a good time?`;
            break;
          case 'negative':
            responseContent = Math.random() > 0.5
              ? `Thank you, but I'm not interested at this time. Please remove me from your list.`
              : `I don't think this is relevant to me right now. Please don't contact me again.`;
            break;
          case 'neutral':
            responseContent = Math.random() > 0.5
              ? `Can you provide more information about what exactly you're offering?`
              : `I'm not sure I understand what this is about. Could you clarify?`;
            break;
        }
        
        const inboundMsg: Message = {
          id: String(messageId++),
          contactId: contact.id,
          campaignId: campaign.id,
          content: responseContent,
          body: responseContent,
          sentAt: responseDate,
          status: 'received',
          type: 'inbound',
          responseType: responseType
        };
        allMessages.push(inboundMsg);
        
        // Add follow-up for positive/neutral responses (but not always)
        if (responseType !== 'negative' && Math.random() > 0.3) {
          const followUpDelayHours = Math.floor(Math.random() * 24) + 2; // 2-26 hours
          const followUpDate = new Date(responseDate.getTime() + followUpDelayHours * 60 * 60 * 1000);
          
          // Different follow-ups based on the initial response
          let followUpContent = '';
          if (responseType === 'positive') {
            followUpContent = Math.random() > 0.5
              ? `Great! I'd be happy to share more details. How about a quick call next week?`
              : `Excellent! I've attached some information about our offering. Would Tuesday or Thursday work for a brief discussion?`;
          } else { // neutral
            followUpContent = Math.random() > 0.5
              ? `Of course! Our ${campaign.name} is designed to help businesses like yours with [benefit]. Would you like to see a demo?`
              : `I'd be happy to clarify. Our solution addresses [pain point] by providing [solution]. Does that align with your needs?`;
          }
          
          const followUpMsg: Message = {
            id: String(messageId++),
            contactId: contact.id,
            campaignId: campaign.id,
            content: followUpContent,
            body: followUpContent,
            sentAt: followUpDate,
            status: 'delivered',
            type: 'outbound'
          };
          allMessages.push(followUpMsg);
          
          // For completed campaigns and positive initial responses, add more back-and-forth
          if (isCompleted && responseType === 'positive' && Math.random() > 0.4) {
            const secondResponseDelayHours = Math.floor(Math.random() * 24) + 1;
            const secondResponseDate = new Date(followUpDate.getTime() + secondResponseDelayHours * 60 * 60 * 1000);
            
            const secondResponseContent = Math.random() > 0.5
              ? `That sounds perfect. I'm available on Tuesday at 2 PM. Would that work for you?`
              : `I'd definitely like to see a demo. Can we schedule something for next week?`;
            
            const secondInboundMsg: Message = {
              id: String(messageId++),
              contactId: contact.id,
              campaignId: campaign.id,
              content: secondResponseContent,
              body: secondResponseContent,
              sentAt: secondResponseDate,
              status: 'received',
              type: 'inbound',
              responseType: 'positive'
            };
            allMessages.push(secondInboundMsg);
            
            // Final confirmation message
            const finalResponseDelayHours = Math.floor(Math.random() * 12) + 1;
            const finalResponseDate = new Date(secondResponseDate.getTime() + finalResponseDelayHours * 60 * 60 * 1000);
            
            const finalResponseContent = Math.random() > 0.5
              ? `Perfect! I've sent you a calendar invite for Tuesday at 2 PM. Looking forward to our conversation!`
              : `Great! I've scheduled a demo for next Monday at 11 AM. I'll send you the meeting details shortly.`;
            
            const finalOutboundMsg: Message = {
              id: String(messageId++),
              contactId: contact.id,
              campaignId: campaign.id,
              content: finalResponseContent,
              body: finalResponseContent,
              sentAt: finalResponseDate,
              status: 'delivered',
              type: 'outbound'
            };
            allMessages.push(finalOutboundMsg);
          }
        }
      }
    }
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
