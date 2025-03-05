
// Demo data generator functions for analytics
export function generateDemoMessageActivity() {
  const days = 14;
  const result = [];
  
  for (let i = 0; i < days; i++) {
    // Create a pattern with steady increase in activity
    const baseOutbound = 8 + Math.floor(i * 1.2);
    const baseInbound = 3 + Math.floor(i * 0.8);
    
    // Add randomness
    const outbound = baseOutbound + Math.floor(Math.random() * 5);
    const inbound = baseInbound + Math.floor(Math.random() * 4);
    
    // Format to readable date (Oct 1, Oct 2, etc.)
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    
    result.push({
      date: `${month} ${day}`,
      outbound,
      inbound
    });
  }
  
  return result;
}

export function generateDemoSentimentOverTime() {
  const days = 14;
  const result = [];
  
  for (let i = 0; i < days; i++) {
    // Create a trend: positive increases over time, negative decreases
    const positiveBase = 3 + Math.floor(i / 2); // Gradually increases
    const positive = positiveBase + Math.floor(Math.random() * 3);
    
    // Calculate negative trend (decreasing)
    const negativeBase = Math.max(0, 5 - Math.floor(i / 3)); // Gradually decreases
    const negative = negativeBase + Math.floor(Math.random() * 2);
    
    // Neutral stays relatively stable
    const neutral = 2 + Math.floor(Math.random() * 3);
    
    // Format to readable date (Oct 1, Oct 2, etc.)
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    const month = date.toLocaleString('en-US', { month: 'short' });
    const day = date.getDate();
    
    result.push({
      date: `${month} ${day}`,
      positive,
      neutral,
      negative
    });
  }
  
  return result;
}

export function generateDemoTimeOfDay() {
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

export function generateDemoDayOfWeek() {
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
