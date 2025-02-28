
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2 } from 'lucide-react';

interface Mapping {
  field: string;
  header: string;
}

interface FieldMappingFormProps {
  mappings: Mapping[];
  onMappingChange: (mappings: Mapping[]) => void;
}

const FieldMappingForm: React.FC<FieldMappingFormProps> = ({
  mappings,
  onMappingChange
}) => {
  const handleMappingChange = (field: string, header: string) => {
    const newMappings = mappings.map(mapping => {
      if (mapping.field === field) {
        return { ...mapping, header };
      }
      return mapping;
    });
    
    onMappingChange(newMappings);
  };
  
  // Common field options for mapping
  const fieldOptions = [
    { value: 'email', label: 'Email' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'company', label: 'Company' },
    { value: 'jobTitle', label: 'Job Title' },
    { value: 'phone', label: 'Phone' },
    { value: 'country', label: 'Country' },
    { value: 'state', label: 'State/Province' },
    { value: 'city', label: 'City' },
    { value: 'notes', label: 'Notes' },
    { value: 'linkedIn', label: 'LinkedIn URL' },
    { value: 'twitter', label: 'Twitter Handle' },
  ];
  
  // Get unique headers from mappings
  const headers = Array.from(new Set(mappings.map(m => m.header)));
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Settings2 className="h-5 w-5 text-primary mr-2" />
          Map CSV Fields
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          We've attempted to automatically map your CSV columns to the appropriate fields.
          Please review and adjust as needed.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldOptions.map(field => (
            <div key={field.value} className="space-y-2">
              <Label htmlFor={`field-${field.value}`}>{field.label}</Label>
              <Select
                value={mappings.find(m => m.field === field.value)?.header || ''}
                onValueChange={(value) => handleMappingChange(field.value, value)}
              >
                <SelectTrigger id={`field-${field.value}`}>
                  <SelectValue placeholder="Not mapped" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Not mapped</SelectItem>
                  {headers.map(header => (
                    <SelectItem key={header} value={header}>
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldMappingForm;
