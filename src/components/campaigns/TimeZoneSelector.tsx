
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TimeZoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ value, onChange }) => {
  // Comprehensive list of common timezones
  const timeZones = [
    // North America
    { value: 'America/Anchorage', label: 'Alaska Time', offset: 'UTC-9' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
    { value: 'America/Phoenix', label: 'Arizona Time', offset: 'UTC-7' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
    { value: 'America/Halifax', label: 'Atlantic Time', offset: 'UTC-4' },
    { value: 'America/St_Johns', label: 'Newfoundland Time', offset: 'UTC-3:30' },
    
    // South America
    { value: 'America/Sao_Paulo', label: 'Brasília Time', offset: 'UTC-3' },
    { value: 'America/Buenos_Aires', label: 'Argentina Time', offset: 'UTC-3' },
    { value: 'America/Santiago', label: 'Chile Time', offset: 'UTC-4' },
    
    // Europe & Africa
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0' },
    { value: 'Europe/Dublin', label: 'Irish Standard Time', offset: 'UTC+1' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1' },
    { value: 'Europe/Berlin', label: 'Berlin Time', offset: 'UTC+1' },
    { value: 'Europe/Athens', label: 'Eastern European Time', offset: 'UTC+2' },
    { value: 'Europe/Moscow', label: 'Moscow Time', offset: 'UTC+3' },
    { value: 'Africa/Cairo', label: 'Egypt Time', offset: 'UTC+2' },
    { value: 'Africa/Johannesburg', label: 'South Africa Time', offset: 'UTC+2' },
    
    // Asia & Oceania
    { value: 'Asia/Dubai', label: 'Gulf Time', offset: 'UTC+4' },
    { value: 'Asia/Kolkata', label: 'India Time', offset: 'UTC+5:30' },
    { value: 'Asia/Bangkok', label: 'Indochina Time', offset: 'UTC+7' },
    { value: 'Asia/Singapore', label: 'Singapore Time', offset: 'UTC+8' },
    { value: 'Asia/Shanghai', label: 'China Time', offset: 'UTC+8' },
    { value: 'Asia/Tokyo', label: 'Japan Time', offset: 'UTC+9' },
    { value: 'Australia/Perth', label: 'Western Australia Time', offset: 'UTC+8' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: 'UTC+10' },
    { value: 'Pacific/Auckland', label: 'New Zealand Time', offset: 'UTC+12' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time', offset: 'UTC-10' }
  ];
  
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone-selector">Select Time Zone <span className="text-red-500">*</span></Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="timezone-selector">
          <SelectValue placeholder="Select a timezone (required)" />
        </SelectTrigger>
        <SelectContent>
          {timeZones.map(tz => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label} ({tz.offset})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground mt-2">
        All campaign messages will be sent according to this timezone.
      </p>
    </div>
  );
};

export default TimeZoneSelector;
