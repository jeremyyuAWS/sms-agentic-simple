
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TimeZoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({ value, onChange }) => {
  // Sample of common timezones, in a real app you'd have a comprehensive list
  const timeZones = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', offset: 'UTC-8' },
    { value: 'America/Denver', label: 'Mountain Time (MT)', offset: 'UTC-7' },
    { value: 'America/Chicago', label: 'Central Time (CT)', offset: 'UTC-6' },
    { value: 'America/New_York', label: 'Eastern Time (ET)', offset: 'UTC-5' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)', offset: 'UTC+0' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)', offset: 'UTC+1' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)', offset: 'UTC+9' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)', offset: 'UTC+10' }
  ];
  
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone-selector">Select Time Zone</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="timezone-selector">
          <SelectValue placeholder="Select a timezone" />
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
