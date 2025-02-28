
import React, { useState } from 'react';
import { TimeZoneOption } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Common time zones
const TIME_ZONES: TimeZoneOption[] = [
  { value: 'America/New_York', label: 'Eastern Time', offset: 'UTC-05:00', abbr: 'ET' },
  { value: 'America/Chicago', label: 'Central Time', offset: 'UTC-06:00', abbr: 'CT' },
  { value: 'America/Denver', label: 'Mountain Time', offset: 'UTC-07:00', abbr: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific Time', offset: 'UTC-08:00', abbr: 'PT' },
  { value: 'America/Anchorage', label: 'Alaska Time', offset: 'UTC-09:00', abbr: 'AKT' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', offset: 'UTC-10:00', abbr: 'HST' },
  { value: 'Europe/London', label: 'Greenwich Mean Time', offset: 'UTC+00:00', abbr: 'GMT' },
  { value: 'Europe/Paris', label: 'Central European Time', offset: 'UTC+01:00', abbr: 'CET' },
  { value: 'Europe/Athens', label: 'Eastern European Time', offset: 'UTC+02:00', abbr: 'EET' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time', offset: 'UTC+04:00', abbr: 'GST' },
  { value: 'Asia/Kolkata', label: 'India Standard Time', offset: 'UTC+05:30', abbr: 'IST' },
  { value: 'Asia/Shanghai', label: 'China Standard Time', offset: 'UTC+08:00', abbr: 'CST' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time', offset: 'UTC+09:00', abbr: 'JST' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time', offset: 'UTC+10:00', abbr: 'AET' },
  { value: 'Pacific/Auckland', label: 'New Zealand Standard Time', offset: 'UTC+12:00', abbr: 'NZST' }
];

interface TimeZoneSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
  value,
  onChange,
  className
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  
  // Get the current selection
  const selectedTimeZone = value
    ? TIME_ZONES.find(tz => tz.value === value)
    : undefined;
  
  // Get local time zone if possible
  const getLocalTimeZone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return 'America/New_York'; // Default fallback
    }
  };
  
  // Handle setting timezone to local
  const handleUseLocalTimeZone = () => {
    const localTZ = getLocalTimeZone();
    onChange(localTZ);
    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <GlobeIcon className="h-4 w-4 text-muted-foreground" />
        <Label>Time Zone</Label>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedTimeZone ? (
              <div className="flex items-center gap-1 justify-start text-left">
                <span>{selectedTimeZone.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({selectedTimeZone.offset})
                </span>
              </div>
            ) : (
              "Select time zone..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search time zones..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <div className="p-2 border-b">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-muted-foreground"
                onClick={handleUseLocalTimeZone}
              >
                Use my local time zone ({getLocalTimeZone().replace('_', ' ')})
              </Button>
            </div>
            <CommandEmpty>No time zone found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {TIME_ZONES.map((timeZone) => (
                <CommandItem
                  key={timeZone.value}
                  value={timeZone.value}
                  onSelect={() => {
                    onChange(timeZone.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === timeZone.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{timeZone.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {timeZone.offset} {timeZone.abbr && `(${timeZone.abbr})`}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeZoneSelector;
