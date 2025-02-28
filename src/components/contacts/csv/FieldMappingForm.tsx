
import React from 'react';
import { TypeInfo, FieldMappingItem } from './types';
import { knownFields } from './fields-definition';
import { Form, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Info, AlertCircle, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Schema for field mapping form - make both fields required to match FieldMappingItem
const fieldMappingSchema = z.object({
  fieldMappings: z.array(z.object({
    csvHeader: z.string(),
    mappedTo: z.string()
  }))
});

type FieldMappingFormValues = z.infer<typeof fieldMappingSchema>;

interface FieldMappingFormProps {
  mappings: FieldMappingItem[]; // Use the proper type here
  typeInfo: TypeInfo[];
  onSubmit: (mappings: FieldMappingItem[]) => void;
  onCancel: () => void;
}

const FieldMappingForm: React.FC<FieldMappingFormProps> = ({
  mappings,
  typeInfo,
  onSubmit,
  onCancel
}) => {
  const form = useForm<FieldMappingFormValues>({
    resolver: zodResolver(fieldMappingSchema),
    defaultValues: {
      fieldMappings: mappings
    },
  });

  // Find required fields that aren't mapped
  const requiredFieldsMapped = React.useMemo(() => {
    const mappedFields = form.getValues().fieldMappings.map(m => m.mappedTo);
    const requiredFields = knownFields.filter(f => f.required);
    return requiredFields.map(field => ({
      field: field.key,
      displayName: field.displayName,
      isMapped: mappedFields.includes(field.key)
    }));
  }, [form.getValues().fieldMappings]);

  const missingRequiredFields = requiredFieldsMapped.filter(f => !f.isMapped);

  const handleSubmit = (data: FieldMappingFormValues) => {
    // Ensure all items in the array are FieldMappingItems (both fields are required)
    const validatedMappings: FieldMappingItem[] = data.fieldMappings.map(item => ({
      csvHeader: item.csvHeader,
      mappedTo: item.mappedTo
    }));
    
    onSubmit(validatedMappings);
  };

  // Helper function to get type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'url': return 'bg-purple-100 text-purple-800';
      case 'boolean': return 'bg-yellow-100 text-yellow-800';
      case 'name': return 'bg-orange-100 text-orange-800';
      case 'location': return 'bg-teal-100 text-teal-800';
      case 'job': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Check if sample value is valid for the selected field
  const checkValueValidity = (value: string, fieldKey: string): boolean => {
    if (!value || fieldKey === 'ignore-column' || fieldKey.startsWith('custom-')) return true;
    
    const field = knownFields.find(f => f.key === fieldKey);
    if (!field) return true;
    
    // If the field has a validator, use it
    if (field.validator) {
      return field.validator(value);
    }
    
    // Default to true if no validator
    return true;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium text-lg">Map CSV Columns to Contact Fields</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
      
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-sm text-blue-800">
          We've automatically matched your CSV columns to our contact fields. Please review and adjust if needed.
        </p>
      </div>

      {missingRequiredFields.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              Required fields are missing
            </p>
            <p className="text-sm text-amber-700 mt-1">
              The following required fields need to be mapped: 
              {missingRequiredFields.map(f => (
                <span key={f.field} className="font-semibold"> {f.displayName}</span>
              )).reduce((prev, curr, i) => {
                return i === 0 ? [curr] : [...prev, ', ', curr];
              }, [] as React.ReactNode[])}
            </p>
          </div>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">CSV Column</TableHead>
                  <TableHead className="w-1/3">Map To Field</TableHead>
                  <TableHead className="w-1/3">Sample Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.getValues().fieldMappings.map((mapping, index) => {
                  const headerInfo = typeInfo.find(t => t.csvHeader === mapping.csvHeader);
                  const field = knownFields.find(f => f.key === mapping.mappedTo);
                  const isRequired = field?.required;
                  const sampleValue = headerInfo?.sampleValue || '';
                  const isValidFormat = checkValueValidity(sampleValue, mapping.mappedTo);
                  
                  return (
                    <TableRow key={index} className={isRequired && !mapping.mappedTo ? "bg-amber-50" : ""}>
                      <TableCell>
                        <div className="font-medium">{mapping.csvHeader}</div>
                        <div className="text-xs mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(headerInfo?.detectedType || 'unknown')}`}>
                            {headerInfo?.detectedType || 'unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`fieldMappings.${index}.mappedTo`}
                            render={({ field }) => (
                              <div className="relative w-full">
                                <Select 
                                  value={field.value} 
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger 
                                    className={`w-full ${isRequired && !field.value ? "border-amber-500" : ""}`}
                                  >
                                    <SelectValue placeholder="Select field" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ignore-column">-- Ignore this column --</SelectItem>
                                    
                                    {/* Group: Required Fields */}
                                    <div className="py-1 px-2 text-xs font-bold text-muted-foreground">
                                      Required Fields
                                    </div>
                                    <Separator className="my-1" />
                                    {knownFields.filter(f => f.required).map((knownField) => (
                                      <SelectItem key={knownField.key} value={knownField.key} className="font-medium">
                                        {knownField.displayName} *
                                      </SelectItem>
                                    ))}
                                    
                                    {/* Group: Optional Fields */}
                                    <div className="py-1 px-2 text-xs font-bold text-muted-foreground mt-1">
                                      Optional Fields
                                    </div>
                                    <Separator className="my-1" />
                                    {knownFields.filter(f => !f.required).map((knownField) => (
                                      <SelectItem key={knownField.key} value={knownField.key}>
                                        {knownField.displayName}
                                      </SelectItem>
                                    ))}
                                    
                                    {/* Group: Custom */}
                                    <div className="py-1 px-2 text-xs font-bold text-muted-foreground mt-1">
                                      Custom
                                    </div>
                                    <Separator className="my-1" />
                                    <SelectItem value={`custom-${mapping.csvHeader}`}>
                                      Custom: "{mapping.csvHeader}"
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex-shrink-0">
                                  {mapping.mappedTo !== 'ignore-column' && mapping.mappedTo !== '' && isValidFormat && (
                                    <Check className="h-5 w-5 text-green-500" />
                                  )}
                                  {mapping.mappedTo !== 'ignore-column' && mapping.mappedTo !== '' && !isValidFormat && (
                                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {isValidFormat 
                                  ? "Valid format for this field" 
                                  : `Sample value doesn't match the expected format for ${field?.displayName}`
                                }
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {headerInfo?.sampleValue || ''}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">* Required fields</p>
            </div>
            <Button 
              type="submit"
              disabled={missingRequiredFields.length > 0}
              title={missingRequiredFields.length > 0 ? "Map all required fields before continuing" : ""}
            >
              Apply Mapping
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FieldMappingForm;
