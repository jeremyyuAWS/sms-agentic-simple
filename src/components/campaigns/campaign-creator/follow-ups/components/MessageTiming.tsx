
import React from 'react';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export interface TimingOption {
  value: string;
  label: string;
}

interface MessageTimingProps {
  value?: string;
  onChange?: (value: string) => void;
  delayDays?: number | string;
  onDelayChange?: (days: number | string) => void;
  isInitialMessage: boolean;
}

// Common wait times for follow-up messages
export const commonDelayOptions: TimingOption[] = [
  { value: "2", label: "2 days (aggressive)" },
  { value: "3", label: "3 days (standard)" },
  { value: "5", label: "5 days (relaxed)" },
  { value: "7", label: "7 days (conservative)" },
  { value: "14", label: "14 days (very patient)" }
];

const MessageTiming: React.FC<MessageTimingProps> = ({ 
  value, 
  onChange, 
  delayDays, 
  onDelayChange, 
  isInitialMessage 
}) => {
  if (isInitialMessage) {
    return null;
  }

  // Use either value/onChange or delayDays/onDelayChange
  const currentValue = value || (delayDays?.toString() || "3");
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    } else if (onDelayChange) {
      onDelayChange(newValue);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">When to send this message:</label>
      <Select
        value={currentValue}
        onValueChange={handleChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select timing" />
        </SelectTrigger>
        <SelectContent>
          {commonDelayOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MessageTiming;
