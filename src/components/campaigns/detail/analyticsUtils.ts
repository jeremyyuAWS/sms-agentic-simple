
import { Message } from '@/lib/types';
import { format } from 'date-fns';

export function generateTimeOfDayData(messages: Message[]) {
  const hourCounts = Array(24).fill(0).map((_, i) => ({ hour: i.toString().padStart(2, '0'), count: 0 }));
  
  messages.forEach(message => {
    if (message.sentAt) {
      const hour = new Date(message.sentAt).getHours();
      hourCounts[hour].count += 1;
    }
  });
  
  return hourCounts;
}

export function generateDayOfWeekData(messages: Message[]) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = days.map(day => ({ day, count: 0 }));
  
  messages.forEach(message => {
    if (message.sentAt) {
      const dayOfWeek = new Date(message.sentAt).getDay();
      dayCounts[dayOfWeek].count += 1;
    }
  });
  
  return dayCounts;
}

export function generateSentimentData(messages: Message[]) {
  let positive = 0;
  let neutral = 0;
  let negative = 0;
  
  messages.forEach(message => {
    if (message.type === 'inbound' && message.responseType) {
      if (message.responseType === 'positive') positive++;
      else if (message.responseType === 'negative') negative++;
      else neutral++;
    }
  });
  
  return [
    { name: 'Positive', value: positive },
    { name: 'Neutral', value: neutral },
    { name: 'Negative', value: negative }
  ];
}

export function generateSentimentOverTimeData(messages: Message[]) {
  if (messages.length === 0) return [];
  
  // Sort messages by date
  const sortedMessages = [...messages].filter(m => m.type === 'inbound' && m.responseType)
    .sort((a, b) => new Date(a.sentAt || 0).getTime() - new Date(b.sentAt || 0).getTime());
  
  if (sortedMessages.length === 0) return [];
  
  // Group by date (using day-level granularity)
  const dataByDate: Record<string, { date: string, positive: number, neutral: number, negative: number }> = {};
  
  sortedMessages.forEach(message => {
    if (message.sentAt) {
      const date = new Date(message.sentAt);
      const dateStr = format(date, 'MMM d');
      
      if (!dataByDate[dateStr]) {
        dataByDate[dateStr] = { date: dateStr, positive: 0, neutral: 0, negative: 0 };
      }
      
      if (message.responseType === 'positive') dataByDate[dateStr].positive++;
      else if (message.responseType === 'negative') dataByDate[dateStr].negative++;
      else dataByDate[dateStr].neutral++;
    }
  });
  
  return Object.values(dataByDate);
}

export function generateMessageActivityData(messages: Message[]) {
  if (messages.length === 0) return [];
  
  // Sort messages by date
  const sortedMessages = [...messages].filter(m => m.sentAt)
    .sort((a, b) => 
      new Date(a.sentAt || 0).getTime() - new Date(b.sentAt || 0).getTime()
    );
  
  if (sortedMessages.length === 0) return [];
  
  // Group by date (using day-level granularity)
  const dataByDate: Record<string, { date: string, outbound: number, inbound: number }> = {};
  
  sortedMessages.forEach(message => {
    if (message.sentAt) {
      const date = new Date(message.sentAt);
      const dateStr = format(date, 'MMM d');
      
      if (!dataByDate[dateStr]) {
        dataByDate[dateStr] = { date: dateStr, outbound: 0, inbound: 0 };
      }
      
      if (message.type === 'outbound') dataByDate[dateStr].outbound++;
      else dataByDate[dateStr].inbound++;
    }
  });
  
  return Object.values(dataByDate);
}

export function calculatePositiveSentimentPercentage(messages: Message[]) {
  const inboundMessages = messages.filter(m => m.type === 'inbound' && m.responseType);
  if (inboundMessages.length === 0) return '0.0';
  
  const positiveCount = inboundMessages.filter(m => m.responseType === 'positive').length;
  return ((positiveCount / inboundMessages.length) * 100).toFixed(1);
}
