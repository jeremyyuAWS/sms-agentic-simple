
import React, { useState } from 'react';
import { TimeWindow, TimeWindowOption } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Clock, Check, Calendar, ChevronDown } from 'lucide-react';

interface TimeWindowSelectorProps {
  value: TimeWindow | undefined;
  onChange: (value: TimeWindow | undefined) => void;
  className?: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', abbr: 'Sun' },
  { value: 1, label: 'Monday', abbr: 'Mon' },
  { value: 2, label: 'Tuesday', abbr: 'Tue' },
  { value: 3, label: 'Wednesday', abbr: 'Wed' },
  { value: 4, label: 'Thursday', abbr: 'Thu' },
  { value: 5, label: 'Friday', abbr: 'Fri' },
  { value: 6, label: 'Saturday', abbr: 'Sat' }
];

const PRESET_TIME_WINDOWS: TimeWindowOption[] = [
  { 
    startTime: '09:00', 
    endTime: '17:00', 
    daysOfWeek: [1, 2, 3, 4, 5],
    label: 'Business Hours (9AM-5PM, Weekdays)'
  },
  { 
    startTime: '08:00', 
    endTime: '20:00', 
    daysOfWeek: [1, 2, 3, 4, 5],
    label: 'Extended Hours (8AM-8PM, Weekdays)'
  },
  { 
    startTime: '10:00', 
    endTime: '16:00', 
    daysOfWeek: [1, 2, 3, 4, 5],
    label: 'Core Hours (10AM-4PM, Weekdays)'
  },
  { 
    startTime: '12:00', 
    endTime: '14:00', 
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    label: 'Lunch Hours (12PM-2PM, All Days)'
  },
  { 
    startTime: '09:00', 
    endTime: '18:00', 
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    label: 'All Week (9AM-6PM, Every Day)'
  }
];

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({ 
  value, 
  onChange,
  className 
}) => {
  const [isEnabled, setIsEnabled] = useState(!!value);
  const [activeTab, setActiveTab] = useState<string>(value ? 'custom' : 'preset');
  
  // Initialize the time window with defaults if not provided
  const timeWindow = value || {
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  };

  // Handle enabling/disabling the time window
  const handleEnableChange = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (enabled) {
      // Use default or existing time window
      onChange(timeWindow);
    } else {
      // Clear the time window
      onChange(undefined);
    }
  };

  // Handle selecting a preset time window
  const handlePresetSelect = (preset: TimeWindowOption) => {
    onChange({
      startTime: preset.startTime,
      endTime: preset.endTime,
      daysOfWeek: [...preset.daysOfWeek]
    });
    setIsEnabled(true);
  };

  // Handle updating start time
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!timeWindow) return;
    onChange({
      ...timeWindow,
      startTime: e.target.value
    });
  };

  // Handle updating end time
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!timeWindow) return;
    onChange({
      ...timeWindow,
      endTime: e.target.value
    });
  };

  // Handle toggling a day of the week
  const handleDayToggle = (dayValue: number) => {
    if (!timeWindow) return;
    
    const currentDays = [...timeWindow.daysOfWeek];
    const index = currentDays.indexOf(dayValue);
    
    if (index >= 0) {
      // Remove day if already selected
      currentDays.splice(index, 1);
    } else {
      // Add day if not selected
      currentDays.push(dayValue);
    }
    
    onChange({
      ...timeWindow,
      daysOfWeek: currentDays
    });
  };

  // Format the time window for display
  const formatTimeWindow = (tw: TimeWindow) => {
    const daysText = tw.daysOfWeek.length > 0
      ? tw.daysOfWeek
          .sort((a, b) => a - b)
          .map(day => DAYS_OF_WEEK.find(d => d.value === day)?.abbr)
          .join(', ')
      : 'No days selected';
    
    return `${tw.startTime} - ${tw.endTime}, ${daysText}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Sending Time Window</h3>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={handleEnableChange}
        />
      </div>
      
      {isEnabled && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preset">Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preset" className="space-y-4">
                <div className="grid gap-2">
                  {PRESET_TIME_WINDOWS.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={cn(
                        "justify-start px-3 py-5 h-auto",
                        value?.startTime === preset.startTime && 
                        value?.endTime === preset.endTime && 
                        value?.daysOfWeek.length === preset.daysOfWeek.length &&
                        value?.daysOfWeek.every(d => preset.daysOfWeek.includes(d))
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      )}
                      onClick={() => handlePresetSelect(preset)}
                    >
                      <div className="flex items-start">
                        <div className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5",
                          value?.startTime === preset.startTime && 
                          value?.endTime === preset.endTime && 
                          value?.daysOfWeek.length === preset.daysOfWeek.length &&
                          value?.daysOfWeek.every(d => preset.daysOfWeek.includes(d))
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          {value?.startTime === preset.startTime && 
                          value?.endTime === preset.endTime && 
                          value?.daysOfWeek.length === preset.daysOfWeek.length &&
                          value?.daysOfWeek.every(d => preset.daysOfWeek.includes(d)) && (
                            <Check className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{preset.label}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {preset.startTime} - {preset.endTime}, {
                              preset.daysOfWeek.length === 7 
                                ? 'Every day' 
                                : preset.daysOfWeek.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.abbr).join(', ')
                            }
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={timeWindow.startTime}
                      onChange={handleStartTimeChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={timeWindow.endTime}
                      onChange={handleEndTimeChange}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <Badge
                        key={day.value}
                        variant="outline"
                        className={cn(
                          "cursor-pointer",
                          timeWindow.daysOfWeek.includes(day.value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        )}
                        onClick={() => handleDayToggle(day.value)}
                      >
                        {day.abbr}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onChange({
                        ...timeWindow,
                        daysOfWeek: [1, 2, 3, 4, 5]
                      })}
                    >
                      Weekdays
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onChange({
                        ...timeWindow,
                        daysOfWeek: [0, 6]
                      })}
                    >
                      Weekends
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => onChange({
                        ...timeWindow,
                        daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
                      })}
                    >
                      All Days
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {value && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Messages will be sent during:
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-800">
                    {formatTimeWindow(value)}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeWindowSelector;
