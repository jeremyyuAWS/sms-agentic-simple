
import { Message } from '@/lib/types';
import { format, addDays, addHours, addMinutes, subDays } from 'date-fns';

// Generate richer time distribution data for completed campaigns
export function generateTimeOfDayData(messages: Message[], isDemo: boolean = false) {
  // For demo purposes, generate more interesting data
  if (isDemo) {
    const hourCounts = Array(24).fill(0).map((_, i) => ({ 
      hour: i.toString().padStart(2, '0'), 
      count: 0, 
      responses: 0,
      responseRate: 0 
    }));
    
    // Generate a realistic curve with morning and afternoon peaks
    for (let i = 0; i < 24; i++) {
      // Morning peak around 9-11 AM
      if (i >= 8 && i <= 11) {
        hourCounts[i].count = 15 + Math.floor(Math.random() * 10);
      } 
      // Afternoon peak around 1-4 PM
      else if (i >= 13 && i <= 16) {
        hourCounts[i].count = 20 + Math.floor(Math.random() * 12);
      }
      // Evening activity 6-8 PM
      else if (i >= 18 && i <= 20) {
        hourCounts[i].count = 8 + Math.floor(Math.random() * 7);
      }
      // Lower activity in early morning and late night
      else if ((i >= 0 && i <= 5) || (i >= 21 && i <= 23)) {
        hourCounts[i].count = Math.floor(Math.random() * 5);
      }
      // Normal office hours
      else {
        hourCounts[i].count = 5 + Math.floor(Math.random() * 8);
      }
      
      // Calculate responses (about 30-50% of messages get responses)
      hourCounts[i].responses = Math.floor(hourCounts[i].count * (0.3 + Math.random() * 0.2));
      
      // Calculate response rate
      hourCounts[i].responseRate = hourCounts[i].count > 0 
        ? Math.round((hourCounts[i].responses / hourCounts[i].count) * 100) 
        : 0;
    }
    
    return hourCounts;
  }
  
  // Original implementation for real data
  const hourCounts = Array(24).fill(0).map((_, i) => ({ 
    hour: i.toString().padStart(2, '0'), 
    count: 0,
    responses: 0,
    responseRate: 0
  }));
  
  const responsesByHour = Array(24).fill(0);
  
  messages.forEach(message => {
    if (message.sentAt) {
      const hour = new Date(message.sentAt).getHours();
      
      if (message.type === 'outbound') {
        hourCounts[hour].count += 1;
      } else if (message.type === 'inbound') {
        responsesByHour[hour] += 1;
      }
    }
  });
  
  // Calculate responses and response rates
  hourCounts.forEach((hourData, index) => {
    hourData.responses = responsesByHour[index];
    hourData.responseRate = hourData.count > 0 
      ? Math.round((hourData.responses / hourData.count) * 100)
      : 0;
  });
  
  return hourCounts;
}

export function generateDayOfWeekData(messages: Message[], isDemo: boolean = false) {
  // For demo purposes, generate interesting pattern
  if (isDemo) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = days.map(day => ({ 
      day, 
      count: 0, 
      positive: 0, 
      negative: 0, 
      neutral: 0,
      responseRate: 0
    }));
    
    // Create a pattern: weekdays higher than weekends, Wednesday peak
    dayCounts[0].count = 10 + Math.floor(Math.random() * 8); // Sunday
    dayCounts[1].count = 40 + Math.floor(Math.random() * 15); // Monday
    dayCounts[2].count = 50 + Math.floor(Math.random() * 18); // Tuesday
    dayCounts[3].count = 65 + Math.floor(Math.random() * 20); // Wednesday (peak)
    dayCounts[4].count = 55 + Math.floor(Math.random() * 15); // Thursday
    dayCounts[5].count = 35 + Math.floor(Math.random() * 12); // Friday
    dayCounts[6].count = 15 + Math.floor(Math.random() * 10); // Saturday
    
    // Calculate response types with varying patterns
    dayCounts.forEach(dayData => {
      const totalResponses = Math.floor(dayData.count * (0.3 + Math.random() * 0.2));
      
      // Wednesday and Thursday have better positive ratios
      if (dayData.day === 'Wednesday' || dayData.day === 'Thursday') {
        dayData.positive = Math.floor(totalResponses * (0.6 + Math.random() * 0.2));
        dayData.negative = Math.floor(totalResponses * (0.1 + Math.random() * 0.1));
      } 
      // Monday has more negative responses
      else if (dayData.day === 'Monday') {
        dayData.positive = Math.floor(totalResponses * (0.3 + Math.random() * 0.2));
        dayData.negative = Math.floor(totalResponses * (0.4 + Math.random() * 0.2));
      }
      // Regular distribution for other days
      else {
        dayData.positive = Math.floor(totalResponses * (0.4 + Math.random() * 0.2));
        dayData.negative = Math.floor(totalResponses * (0.2 + Math.random() * 0.2));
      }
      
      dayData.neutral = totalResponses - dayData.positive - dayData.negative;
      
      // Ensure neutral is not negative due to rounding
      if (dayData.neutral < 0) {
        dayData.neutral = 0;
      }
      
      dayData.responseRate = dayData.count > 0 
        ? Math.round(((dayData.positive + dayData.negative + dayData.neutral) / dayData.count) * 100)
        : 0;
    });
    
    return dayCounts;
  }
  
  // Original implementation for real data
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = days.map(day => ({ 
    day, 
    count: 0, 
    positive: 0, 
    negative: 0, 
    neutral: 0,
    responseRate: 0 
  }));
  
  const sentByDay = Array(7).fill(0);
  const responsesByDay = {
    positive: Array(7).fill(0),
    negative: Array(7).fill(0),
    neutral: Array(7).fill(0)
  };
  
  messages.forEach(message => {
    if (message.sentAt) {
      const dayOfWeek = new Date(message.sentAt).getDay();
      
      if (message.type === 'outbound') {
        sentByDay[dayOfWeek] += 1;
      } else if (message.type === 'inbound') {
        if (message.responseType === 'positive') {
          responsesByDay.positive[dayOfWeek] += 1;
        } else if (message.responseType === 'negative') {
          responsesByDay.negative[dayOfWeek] += 1;
        } else {
          responsesByDay.neutral[dayOfWeek] += 1;
        }
      }
    }
  });
  
  // Calculate metrics
  days.forEach((_, index) => {
    dayCounts[index].count = sentByDay[index];
    dayCounts[index].positive = responsesByDay.positive[index];
    dayCounts[index].negative = responsesByDay.negative[index];
    dayCounts[index].neutral = responsesByDay.neutral[index];
    
    const totalResponses = dayCounts[index].positive + dayCounts[index].negative + dayCounts[index].neutral;
    dayCounts[index].responseRate = dayCounts[index].count > 0 
      ? Math.round((totalResponses / dayCounts[index].count) * 100)
      : 0;
  });
  
  return dayCounts;
}

export function generateSentimentData(messages: Message[], isDemo: boolean = false) {
  // For demo purposes, generate interesting sentiment distribution
  if (isDemo) {
    // Create a realistic sentiment distribution with mostly positive responses
    const positive = 45 + Math.floor(Math.random() * 15); // 45-60%
    const negative = 15 + Math.floor(Math.random() * 10); // 15-25%
    const neutral = 100 - positive - negative; // Remaining percentage
    
    return [
      { name: 'Positive', value: positive },
      { name: 'Neutral', value: neutral },
      { name: 'Negative', value: negative }
    ];
  }
  
  // Original implementation for real data
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

export function generateSentimentOverTimeData(messages: Message[], isDemo: boolean = false) {
  // For demo purposes, generate a time series with trend
  if (isDemo) {
    const now = new Date();
    const dataPoints = 14; // Two weeks of data
    const result = [];
    
    // Create a trend: positive increases over time, negative decreases
    for (let i = 0; i < dataPoints; i++) {
      const date = format(subDays(now, dataPoints - i - 1), 'MMM d');
      
      // Calculate positive trend (increasing)
      const positiveBase = 3 + Math.floor(i / 2); // Gradually increases
      const positive = positiveBase + Math.floor(Math.random() * 3);
      
      // Calculate negative trend (decreasing)
      const negativeBase = Math.max(0, 5 - Math.floor(i / 3)); // Gradually decreases
      const negative = negativeBase + Math.floor(Math.random() * 2);
      
      // Neutral stays relatively stable
      const neutral = 2 + Math.floor(Math.random() * 3);
      
      result.push({
        date,
        positive,
        neutral,
        negative
      });
    }
    
    return result;
  }
  
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

export function generateMessageActivityData(messages: Message[], isDemo: boolean = false) {
  // For demo purposes, generate realistic activity data
  if (isDemo) {
    const now = new Date();
    const dataPoints = 14; // Two weeks of data
    const result = [];
    
    // Create a pattern with steady increase in activity
    for (let i = 0; i < dataPoints; i++) {
      const date = format(subDays(now, dataPoints - i - 1), 'MMM d');
      
      // Base values that increase over time
      const baseOutbound = 8 + Math.floor(i * 1.2); 
      const baseInbound = 3 + Math.floor(i * 0.8);
      
      // Add randomness
      const outbound = baseOutbound + Math.floor(Math.random() * 5);
      const inbound = baseInbound + Math.floor(Math.random() * 4);
      
      result.push({
        date,
        outbound,
        inbound
      });
    }
    
    return result;
  }
  
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

export function calculatePositiveSentimentPercentage(messages: Message[], isDemo: boolean = false) {
  // For demo with richer data
  if (isDemo) {
    return (65 + Math.floor(Math.random() * 15)).toFixed(1); // 65-80%
  }
  
  // Original implementation
  const inboundMessages = messages.filter(m => m.type === 'inbound' && m.responseType);
  if (inboundMessages.length === 0) return '0.0';
  
  const positiveCount = inboundMessages.filter(m => m.responseType === 'positive').length;
  return ((positiveCount / inboundMessages.length) * 100).toFixed(1);
}
