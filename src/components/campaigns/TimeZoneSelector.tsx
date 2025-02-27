
import React, { useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { TimeZoneOption } from '@/lib/types';

interface TimeZoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const timeZones: TimeZoneOption[] = [
    // North America
    { value: "America/New_York", label: "Eastern Time (ET)", offset: "UTC-5/4", abbr: "ET" },
    { value: "America/Chicago", label: "Central Time (CT)", offset: "UTC-6/5", abbr: "CT" },
    { value: "America/Denver", label: "Mountain Time (MT)", offset: "UTC-7/6", abbr: "MT" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: "UTC-8/7", abbr: "PT" },
    { value: "America/Anchorage", label: "Alaska Time", offset: "UTC-9/8", abbr: "AKT" },
    { value: "America/Honolulu", label: "Hawaii Time", offset: "UTC-10", abbr: "HST" },
    { value: "America/Halifax", label: "Atlantic Time", offset: "UTC-4/3", abbr: "AST" },
    { value: "America/St_Johns", label: "Newfoundland Time", offset: "UTC-3:30/2:30", abbr: "NST" },
    
    // Europe & Africa
    { value: "Europe/London", label: "Greenwich Mean Time", offset: "UTC+0/1", abbr: "GMT" },
    { value: "Europe/Paris", label: "Central European Time", offset: "UTC+1/2", abbr: "CET" },
    { value: "Europe/Helsinki", label: "Eastern European Time", offset: "UTC+2/3", abbr: "EET" },
    { value: "Europe/Moscow", label: "Moscow Time", offset: "UTC+3", abbr: "MSK" },
    { value: "Africa/Cairo", label: "Eastern Africa Time", offset: "UTC+2", abbr: "EAT" },
    { value: "Africa/Johannesburg", label: "South Africa Standard Time", offset: "UTC+2", abbr: "SAST" },
    
    // Asia & Oceania
    { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+4", abbr: "GST" },
    { value: "Asia/Kolkata", label: "India Standard Time", offset: "UTC+5:30", abbr: "IST" },
    { value: "Asia/Singapore", label: "Singapore Time", offset: "UTC+8", abbr: "SGT" },
    { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "UTC+9", abbr: "JST" },
    { value: "Australia/Sydney", label: "Australian Eastern Time", offset: "UTC+10/11", abbr: "AEST" },
    { value: "Pacific/Auckland", label: "New Zealand Time", offset: "UTC+12/13", abbr: "NZST" },
    
    // South America
    { value: "America/Sao_Paulo", label: "Brasilia Time", offset: "UTC-3", abbr: "BRT" },
    { value: "America/Buenos_Aires", label: "Argentina Time", offset: "UTC-3", abbr: "ART" },
  ];

  // Group time zones by region
  const groupedTimeZones = useMemo(() => {
    return {
      "North America": timeZones.filter(tz => tz.value.startsWith("America")),
      "Europe & Africa": timeZones.filter(tz => tz.value.startsWith("Europe") || tz.value.startsWith("Africa")),
      "Asia & Oceania": timeZones.filter(tz => 
        tz.value.startsWith("Asia") || 
        tz.value.startsWith("Australia") || 
        tz.value.startsWith("Pacific")
      ),
      "South America": timeZones.filter(tz => tz.value.includes("Sao_Paulo") || tz.value.includes("Buenos_Aires"))
    };
  }, []);

  const [searchTerm, setSearchTerm] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);

  const filteredTimeZones = useMemo(() => {
    if (!searchTerm) return timeZones;
    
    const term = searchTerm.toLowerCase();
    return timeZones.filter(tz => 
      tz.label.toLowerCase().includes(term) || 
      tz.value.toLowerCase().includes(term) ||
      tz.offset.toLowerCase().includes(term) ||
      (tz.abbr && tz.abbr.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div className={className}>
      <Label htmlFor="timezone">Time Zone</Label>
      <Select value={value} onValueChange={onChange} onOpenChange={() => setIsSearching(false)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select time zone" />
        </SelectTrigger>
        <SelectContent>
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search time zones..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(true);
                }}
                className="pl-8"
              />
            </div>
          </div>

          {isSearching ? (
            <div className="max-h-[300px] overflow-auto">
              {filteredTimeZones.length > 0 ? 
                filteredTimeZones.map(tz => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <div className="flex justify-between w-full">
                      <span>{tz.label}</span>
                      <span className="text-muted-foreground text-xs">{tz.offset}</span>
                    </div>
                  </SelectItem>
                )) : 
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No time zones found
                </div>
              }
            </div>
          ) : (
            <div className="max-h-[300px] overflow-auto">
              {Object.entries(groupedTimeZones).map(([region, zones]) => (
                <SelectGroup key={region}>
                  <SelectLabel>{region}</SelectLabel>
                  {zones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <div className="flex justify-between w-full">
                        <span>{tz.label}</span>
                        <span className="text-muted-foreground text-xs">{tz.offset}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </div>
          )}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Messages will be sent according to recipient's local time in the selected time zone
      </p>
    </div>
  );
};

export default TimeZoneSelector;
