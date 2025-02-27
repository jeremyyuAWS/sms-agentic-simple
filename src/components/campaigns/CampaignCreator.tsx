
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Clock, CalendarIcon } from 'lucide-react';
import { Campaign } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const CampaignCreator: React.FC = () => {
  const { templates, createCampaign } = useApp();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    templateId: '',
    timeZone: 'America/New_York',
    startTime: '09:00',
    endTime: '17:00',
    daysOfWeek: [1, 2, 3, 4, 5]
  });
  
  const timeZones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' }
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Campaign name is required.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.templateId) {
      toast({
        title: "Validation Error",
        description: "Please select a message template.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const newCampaign: Omit<Campaign, 'id' | 'createdAt'> = {
      name: formData.name,
      description: formData.description,
      status: 'draft',
      contactCount: 0,
      templateId: formData.templateId,
      timeZone: formData.timeZone,
      sendingWindow: {
        startTime: formData.startTime,
        endTime: formData.endTime,
        daysOfWeek: formData.daysOfWeek
      }
    };
    
    createCampaign(newCampaign);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      templateId: '',
      timeZone: 'America/New_York',
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5]
    });
  };
  
  return (
    <AnimatedCard>
      <h2 className="text-xl font-medium mb-6">Create New Campaign</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="E.g., Q4 Outreach Campaign"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1.5"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the purpose of this campaign"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1.5 resize-none h-24"
            />
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-3">Message Template</h3>
          
          <Select
            value={formData.templateId}
            onValueChange={(value) => handleSelectChange('templateId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {formData.templateId && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
              {templates.find(t => t.id === formData.templateId)?.body}
            </div>
          )}
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-3">Sending Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timeZone">Time Zone</Label>
              <Select
                value={formData.timeZone}
                onValueChange={(value) => handleSelectChange('timeZone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time zone" />
                </SelectTrigger>
                <SelectContent>
                  {timeZones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <div className="relative mt-1.5">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <div className="relative mt-1.5">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <Label>Sending Days</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <Button
                  key={day}
                  type="button"
                  variant={formData.daysOfWeek.includes(index) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newDays = formData.daysOfWeek.includes(index)
                      ? formData.daysOfWeek.filter(d => d !== index)
                      : [...formData.daysOfWeek, index];
                    setFormData(prev => ({ ...prev, daysOfWeek: newDays }));
                  }}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <Button type="submit">
            Create Campaign
          </Button>
        </div>
      </form>
    </AnimatedCard>
  );
};

export default CampaignCreator;
