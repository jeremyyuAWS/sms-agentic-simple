
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Campaign, TimeWindowOption } from "@/lib/types";
import { useApp } from "@/contexts";
import { PlusCircle, AlertCircle } from "lucide-react";
import TimeZoneSelector from "./TimeZoneSelector";
import TimeWindowSelector from "./TimeWindowSelector";

export default function CampaignCreator() {
  const { createCampaign, templates } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [timeZone, setTimeZone] = useState("America/New_York");
  const [timeWindow, setTimeWindow] = useState<TimeWindowOption>({
    startTime: "09:00",
    endTime: "17:00",
    daysOfWeek: [1, 2, 3, 4, 5]
  });
  const [advancedOptionsOpen, setAdvancedOptionsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const now = new Date();
    
    const campaign: Omit<Campaign, "id" | "createdAt"> = {
      name,
      description,
      status: "draft",
      updatedAt: now,
      contactCount: 0,
      templateId,
      timeZone,
      sendingWindow: {
        startTime: timeWindow.startTime,
        endTime: timeWindow.endTime,
        daysOfWeek: timeWindow.daysOfWeek
      }
    };
    
    createCampaign(campaign);
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setTemplateId("");
    setTimeZone("America/New_York");
    setTimeWindow({
      startTime: "09:00",
      endTime: "17:00",
      daysOfWeek: [1, 2, 3, 4, 5]
    });
    setAdvancedOptionsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Set up your campaign details. You can save as draft and edit later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Q2 Conference Follow-up"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Brief description of your campaign objectives"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Message Template</Label>
              {templates.length === 0 ? (
                <div className="rounded-md border p-3 bg-yellow-50 text-yellow-700 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No templates available</p>
                    <p className="text-sm">
                      You need to create at least one template before you can create a campaign.
                      <a href="/templates" className="underline ml-1">Create a template</a>
                    </p>
                  </div>
                </div>
              ) : (
                <Select value={templateId} onValueChange={setTemplateId} required>
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
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setAdvancedOptionsOpen(!advancedOptionsOpen)}
              >
                {advancedOptionsOpen ? "Hide" : "Show"} Advanced Options
              </Button>
            </div>
            
            {advancedOptionsOpen && (
              <div className="space-y-6 border-t pt-4 mt-4">
                <h3 className="text-sm font-medium">Time Zone & Sending Window</h3>
                
                <TimeZoneSelector 
                  value={timeZone} 
                  onChange={setTimeZone} 
                  className="mb-6"
                />
                
                <TimeWindowSelector 
                  value={timeWindow} 
                  onChange={setTimeWindow} 
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={templates.length === 0}>
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
