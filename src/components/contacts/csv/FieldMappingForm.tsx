
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2 } from 'lucide-react';

interface FieldMapping {
  field: string;
  header: string;
}

interface FieldMappingFormProps {
  mappings: FieldMapping[];
  onMappingChange: (mappings: FieldMapping[]) => void;
}

const FieldMappingForm: React.FC<FieldMappingFormProps> = ({ mappings, onMappingChange }) => {
  const handleMappingChange = (index: number, field: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index] = {
      ...updatedMappings[index],
      field,
    };
    onMappingChange(updatedMappings);
  };

  // Validate if a field has the expected format
  const isFieldValidated = (mapping: FieldMapping, validContacts: any[]): boolean => {
    // If no field mapping is selected or it's set to skip, return false
    if (!mapping.field || mapping.field === 'skip') return false;
    
    // For demonstration, we're checking if email fields have @ symbol
    // In a real app you would have more comprehensive validation based on field type
    if (mapping.field === 'email') {
      return true; // We assume emails are already validated during CSV processing
    }
    
    return mapping.field !== 'skip'; // Consider any mapped field as validated
  };

  const options = [
    { label: "Email Address", value: "email" },
    { label: "First Name", value: "firstName" },
    { label: "Last Name", value: "lastName" },
    { label: "Full Name", value: "name" },
    { label: "Phone Number", value: "phone" },
    { label: "Company", value: "company" },
    { label: "Job Title", value: "jobTitle" },
    { label: "LinkedIn URL", value: "linkedIn" },
    { label: "Twitter", value: "twitter" },
    { label: "Notes", value: "notes" },
    { label: "Country", value: "country" },
    { label: "State/Province", value: "state" },
    { label: "City", value: "city" },
    { label: "Skip Column", value: "skip" }, // Changed from empty string to "skip"
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Map CSV Columns</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] w-full">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSV Header</TableHead>
                  <TableHead>Map To Field</TableHead>
                  <TableHead className="w-[80px] text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.map((mapping, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{mapping.header}</TableCell>
                    <TableCell>
                      <Select
                        value={mapping.field || "skip"} // Default to "skip" if field is empty
                        onValueChange={(value) => handleMappingChange(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a field" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      {isFieldValidated(mapping, []) && (
                        <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FieldMappingForm;
