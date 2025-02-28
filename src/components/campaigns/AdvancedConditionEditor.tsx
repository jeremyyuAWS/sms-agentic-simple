import React, { useState } from 'react';
import { FollowUpCondition, TimeWindow } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  Filter,
  Calendar as CalendarIcon,
  Clock,
  PlusCircle,
  Trash2,
  MessageSquare,
  Search
} from 'lucide-react';

interface AdvancedConditionEditorProps {
  conditions: FollowUpCondition[];
  onChange: (conditions: FollowUpCondition[]) => void;
}

const DEFAULT_CONDITION: FollowUpCondition = {
  type: 'no-response',
};

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

const TIME_PERIODS = [
  { startTime: '09:00', endTime: '17:00', label: 'Working Hours (9AM-5PM)' },
  { startTime: '08:00', endTime: '12:00', label: 'Morning (8AM-12PM)' },
  { startTime: '12:00', endTime: '17:00', label: 'Afternoon (12PM-5PM)' },
  { startTime: '17:00', endTime: '20:00', label: 'Evening (5PM-8PM)' }
];

const AdvancedConditionEditor: React.FC<AdvancedConditionEditorProps> = ({
  conditions,
  onChange
}) => {
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [newCondition, setNewCondition] = useState<FollowUpCondition>(DEFAULT_CONDITION);

  // Helper function to get condition type label
  const getConditionTypeLabel = (type: FollowUpCondition['type']) => {
    switch (type) {
      case 'all':
        return 'All Contacts';
      case 'no-response':
        return 'No Response';
      case 'positive-response':
        return 'Positive Response';
      case 'negative-response':
        return 'Negative Response';
      case 'keyword':
        return 'Contains Keywords';
      default:
        return 'Unknown Condition';
    }
  };

  // Helper function to get condition type icon
  const getConditionTypeIcon = (type: FollowUpCondition['type']) => {
    switch (type) {
      case 'all':
        return <Filter className="h-4 w-4" />;
      case 'no-response':
        return <MessageSquare className="h-4 w-4" />;
      case 'positive-response':
        return <MessageSquare className="h-4 w-4" />;
      case 'negative-response':
        return <MessageSquare className="h-4 w-4" />;
      case 'keyword':
        return <Search className="h-4 w-4" />;
      default:
        return <Filter className="h-4 w-4" />;
    }
  };

  // Helper function to get condition type color
  const getConditionTypeColor = (type: FollowUpCondition['type']) => {
    switch (type) {
      case 'all':
        return 'bg-gray-100 text-gray-800';
      case 'no-response':
        return 'bg-red-100 text-red-800';
      case 'positive-response':
        return 'bg-green-100 text-green-800';
      case 'negative-response':
        return 'bg-yellow-100 text-yellow-800';
      case 'keyword':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle adding a new condition
  const handleAddCondition = () => {
    const updatedConditions = [...conditions, newCondition];
    onChange(updatedConditions);
    setNewCondition(DEFAULT_CONDITION);
    setIsAddingCondition(false);
  };

  // Handle removing a condition
  const handleRemoveCondition = (index: number) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    onChange(updatedConditions);
  };

  // Handle updating a condition
  const handleUpdateCondition = (index: number, updatedCondition: FollowUpCondition) => {
    const updatedConditions = [...conditions];
    updatedConditions[index] = updatedCondition;
    onChange(updatedConditions);
  };

  // Format time window for display
  const formatTimeWindow = (timeWindow?: TimeWindow) => {
    if (!timeWindow) return 'Any time';
    
    const daysText = timeWindow.daysOfWeek.length > 0
      ? timeWindow.daysOfWeek.map(day => DAYS_OF_WEEK.find(d => d.value === day)?.label).join(', ')
      : 'Any day';
    
    return `${timeWindow.startTime} - ${timeWindow.endTime}, ${daysText}`;
  };

  // Handle selecting a predefined time period
  const handleSelectTimePeriod = (period: { startTime: string, endTime: string }, condition: FollowUpCondition) => {
    const updatedTimeWindow: TimeWindow = {
      startTime: period.startTime,
      endTime: period.endTime,
      daysOfWeek: condition.timeWindow?.daysOfWeek || [1, 2, 3, 4, 5] // Default to weekdays
    };
    
    return {
      ...condition,
      timeWindow: updatedTimeWindow
    };
  };

  // Handle toggling a day of week
  const handleToggleDay = (day: number, condition: FollowUpCondition) => {
    const currentDays = condition.timeWindow?.daysOfWeek || [];
    let newDays: number[];
    
    if (currentDays.includes(day)) {
      newDays = currentDays.filter(d => d !== day);
    } else {
      newDays = [...currentDays, day];
    }
    
    return {
      ...condition,
      timeWindow: {
        ...condition.timeWindow,
        daysOfWeek: newDays
      } as TimeWindow
    };
  };

  // Handle adding a keyword
  const handleAddKeyword = (keyword: string, condition: FollowUpCondition) => {
    if (!keyword.trim()) return condition;
    
    const currentKeywords = condition.keywords || [];
    if (currentKeywords.includes(keyword.trim())) return condition;
    
    return {
      ...condition,
      keywords: [...currentKeywords, keyword.trim()]
    };
  };

  // Handle removing a keyword
  const handleRemoveKeyword = (keyword: string, condition: FollowUpCondition) => {
    if (!condition.keywords) return condition;
    
    return {
      ...condition,
      keywords: condition.keywords.filter(k => k !== keyword)
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Advanced Conditions</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingCondition(true)}
          disabled={isAddingCondition}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
      </div>

      {/* Existing Conditions */}
      {conditions.length > 0 ? (
        <div className="space-y-3">
          {conditions.map((condition, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getConditionTypeColor(condition.type)}>
                      {getConditionTypeIcon(condition.type)}
                      <span className="ml-1">{getConditionTypeLabel(condition.type)}</span>
                    </Badge>
                    {condition.timeWindow && (
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        <Clock className="h-4 w-4 mr-1" />
                        Time Window
                      </Badge>
                    )}
                    {condition.excludeDays && condition.excludeDays.length > 0 && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        Excludes Days
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveCondition(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="condition-details">
                    <AccordionTrigger className="text-sm">Condition Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {/* Condition Type */}
                        <div>
                          <Label className="text-sm">Condition Type</Label>
                          <Select 
                            value={condition.type}
                            onValueChange={(value: FollowUpCondition['type']) => 
                              handleUpdateCondition(index, { ...condition, type: value })
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select condition type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Contacts</SelectItem>
                              <SelectItem value="no-response">No Response</SelectItem>
                              <SelectItem value="positive-response">Positive Response</SelectItem>
                              <SelectItem value="negative-response">Negative Response</SelectItem>
                              <SelectItem value="keyword">Contains Keywords</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Keywords (only for keyword type) */}
                        {condition.type === 'keyword' && (
                          <div className="space-y-2">
                            <Label className="text-sm">Keywords</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {condition.keywords && condition.keywords.length > 0 ? (
                                condition.keywords.map((keyword, keywordIndex) => (
                                  <Badge key={keywordIndex} variant="secondary" className="gap-1">
                                    {keyword}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => handleUpdateCondition(
                                        index, 
                                        handleRemoveKeyword(keyword, condition)
                                      )}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">No keywords added</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Input 
                                placeholder="Add keyword"
                                className="flex-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    handleUpdateCondition(
                                      index, 
                                      handleAddKeyword(input.value, condition)
                                    );
                                    input.value = '';
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  handleUpdateCondition(
                                    index, 
                                    handleAddKeyword(input.value, condition)
                                  );
                                  input.value = '';
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Time Window */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">Time Window</Label>
                            <Switch
                              checked={!!condition.timeWindow}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleUpdateCondition(index, {
                                    ...condition,
                                    timeWindow: {
                                      startTime: '09:00',
                                      endTime: '17:00',
                                      daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
                                    }
                                  });
                                } else {
                                  const { timeWindow, ...rest } = condition;
                                  handleUpdateCondition(index, rest);
                                }
                              }}
                            />
                          </div>
                          
                          {condition.timeWindow && (
                            <div className="space-y-3 mt-2">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-xs">Start Time</Label>
                                  <Input
                                    type="time"
                                    value={condition.timeWindow.startTime}
                                    onChange={(e) => handleUpdateCondition(index, {
                                      ...condition,
                                      timeWindow: {
                                        ...condition.timeWindow as TimeWindow,
                                        startTime: e.target.value
                                      }
                                    })}
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">End Time</Label>
                                  <Input
                                    type="time"
                                    value={condition.timeWindow.endTime}
                                    onChange={(e) => handleUpdateCondition(index, {
                                      ...condition,
                                      timeWindow: {
                                        ...condition.timeWindow as TimeWindow,
                                        endTime: e.target.value
                                      }
                                    })}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-xs">Preset Time Periods</Label>
                                <Select
                                  onValueChange={(value) => {
                                    const period = TIME_PERIODS.find(p => 
                                      `${p.startTime}-${p.endTime}` === value
                                    );
                                    if (period) {
                                      handleUpdateCondition(
                                        index, 
                                        handleSelectTimePeriod(period, condition)
                                      );
                                    }
                                  }}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select a preset time period" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {TIME_PERIODS.map((period, i) => (
                                      <SelectItem 
                                        key={i} 
                                        value={`${period.startTime}-${period.endTime}`}
                                      >
                                        {period.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs mb-1 block">Days of Week</Label>
                                <div className="flex flex-wrap gap-2">
                                  {DAYS_OF_WEEK.map((day) => (
                                    <Badge
                                      key={day.value}
                                      variant="outline"
                                      className={cn(
                                        "cursor-pointer",
                                        condition.timeWindow?.daysOfWeek.includes(day.value)
                                          ? "bg-primary text-primary-foreground"
                                          : "bg-background"
                                      )}
                                      onClick={() => handleUpdateCondition(
                                        index, 
                                        handleToggleDay(day.value, condition)
                                      )}
                                    >
                                      {day.label.substring(0, 3)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Exclude Days */}
                        <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between items-center">
                            <Label className="text-sm">Exclude Specific Days</Label>
                            <Switch
                              checked={!!condition.excludeDays && condition.excludeDays.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  handleUpdateCondition(index, {
                                    ...condition,
                                    excludeDays: ['Saturday', 'Sunday']
                                  });
                                } else {
                                  const { excludeDays, ...rest } = condition;
                                  handleUpdateCondition(index, rest);
                                }
                              }}
                            />
                          </div>
                          
                          {condition.excludeDays && condition.excludeDays.length > 0 && (
                            <div className="space-y-2 mt-2">
                              <div className="flex flex-wrap gap-2">
                                {condition.excludeDays.map((day, dayIndex) => (
                                  <Badge
                                    key={dayIndex}
                                    variant="secondary"
                                    className="gap-1"
                                  >
                                    {day}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() => {
                                        const updatedExcludeDays = [...condition.excludeDays!];
                                        updatedExcludeDays.splice(dayIndex, 1);
                                        handleUpdateCondition(index, {
                                          ...condition,
                                          excludeDays: updatedExcludeDays.length > 0 
                                            ? updatedExcludeDays
                                            : undefined
                                        });
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                              
                              <Select
                                onValueChange={(value) => {
                                  if (!condition.excludeDays?.includes(value)) {
                                    handleUpdateCondition(index, {
                                      ...condition,
                                      excludeDays: [...(condition.excludeDays || []), value]
                                    });
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Add excluded day" />
                                </SelectTrigger>
                                <SelectContent>
                                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Holiday'].map((day) => (
                                    <SelectItem 
                                      key={day} 
                                      value={day}
                                      disabled={condition.excludeDays?.includes(day)}
                                    >
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-3">
              No conditions have been added yet. Add a condition to control when this follow-up should be sent.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddingCondition(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Condition Form */}
      {isAddingCondition && (
        <Card className="border-primary/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Add New Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Condition Type</Label>
              <Select 
                value={newCondition.type}
                onValueChange={(value: FollowUpCondition['type']) => 
                  setNewCondition({ ...newCondition, type: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select condition type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Contacts</SelectItem>
                  <SelectItem value="no-response">No Response</SelectItem>
                  <SelectItem value="positive-response">Positive Response</SelectItem>
                  <SelectItem value="negative-response">Negative Response</SelectItem>
                  <SelectItem value="keyword">Contains Keywords</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newCondition.type === 'keyword' && (
              <div>
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2 my-2">
                  {newCondition.keywords && newCondition.keywords.length > 0 ? (
                    newCondition.keywords.map((keyword, keywordIndex) => (
                      <Badge key={keywordIndex} variant="secondary" className="gap-1">
                        {keyword}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => setNewCondition(handleRemoveKeyword(keyword, newCondition))}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">No keywords added</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add keyword"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        setNewCondition(handleAddKeyword(input.value, newCondition));
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      setNewCondition(handleAddKeyword(input.value, newCondition));
                      input.value = '';
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="add-time-window" 
                checked={!!newCondition.timeWindow}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setNewCondition({
                      ...newCondition,
                      timeWindow: {
                        startTime: '09:00',
                        endTime: '17:00',
                        daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
                      }
                    });
                  } else {
                    const { timeWindow, ...rest } = newCondition;
                    setNewCondition(rest);
                  }
                }}
              />
              <Label htmlFor="add-time-window">Add Time Window</Label>
            </div>
            
            {newCondition.timeWindow && (
              <div className="border-t pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <Input
                      type="time"
                      value={newCondition.timeWindow.startTime}
                      onChange={(e) => setNewCondition({
                        ...newCondition,
                        timeWindow: {
                          ...newCondition.timeWindow as TimeWindow,
                          startTime: e.target.value
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <Input
                      type="time"
                      value={newCondition.timeWindow.endTime}
                      onChange={(e) => setNewCondition({
                        ...newCondition,
                        timeWindow: {
                          ...newCondition.timeWindow as TimeWindow,
                          endTime: e.target.value
                        }
                      })}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs mb-1 block">Days of Week</Label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => (
                      <Badge
                        key={day.value}
                        variant="outline"
                        className={cn(
                          "cursor-pointer",
                          newCondition.timeWindow?.daysOfWeek.includes(day.value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-background"
                        )}
                        onClick={() => setNewCondition(handleToggleDay(day.value, newCondition))}
                      >
                        {day.label.substring(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch 
                id="exclude-days" 
                checked={!!newCondition.excludeDays && newCondition.excludeDays.length > 0}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setNewCondition({
                      ...newCondition,
                      excludeDays: ['Saturday', 'Sunday']
                    });
                  } else {
                    const { excludeDays, ...rest } = newCondition;
                    setNewCondition(rest);
                  }
                }}
              />
              <Label htmlFor="exclude-days">Exclude Specific Days</Label>
            </div>
            
            {newCondition.excludeDays && newCondition.excludeDays.length > 0 && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex flex-wrap gap-2">
                  {newCondition.excludeDays.map((day, dayIndex) => (
                    <Badge
                      key={dayIndex}
                      variant="secondary"
                      className="gap-1"
                    >
                      {day}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          const updatedExcludeDays = [...newCondition.excludeDays!];
                          updatedExcludeDays.splice(dayIndex, 1);
                          setNewCondition({
                            ...newCondition,
                            excludeDays: updatedExcludeDays.length > 0 
                              ? updatedExcludeDays
                              : undefined
                          });
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Select
                  onValueChange={(value) => {
                    if (!newCondition.excludeDays?.includes(value)) {
                      setNewCondition({
                        ...newCondition,
                        excludeDays: [...(newCondition.excludeDays || []), value]
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add excluded day" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Holiday'].map((day) => (
                      <SelectItem 
                        key={day} 
                        value={day}
                        disabled={newCondition.excludeDays?.includes(day)}
                      >
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddingCondition(false);
                setNewCondition(DEFAULT_CONDITION);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddCondition}
              disabled={newCondition.type === 'keyword' && (!newCondition.keywords || newCondition.keywords.length === 0)}
            >
              Add Condition
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AdvancedConditionEditor;
