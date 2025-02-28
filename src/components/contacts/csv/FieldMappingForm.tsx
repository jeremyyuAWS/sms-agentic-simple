
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
import { Info, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
                        <FormField
                          control={form.control}
                          name={`fieldMappings.${index}.mappedTo`}
                          render={({ field }) => (
                            <Select 
                              value={field.value} 
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className={`w-full ${isRequired && !field.value ? "border-amber-500" : ""}`}>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">-- Ignore this column --</SelectItem>
                                <SelectItem value="divider-required" disabled className="py-1 text-xs font-bold text-muted-foreground">
                                  Required Fields
                                </SelectItem>
                                {knownFields.filter(f => f.required).map((knownField) => (
                                  <SelectItem key={knownField.key} value={knownField.key} className="font-medium">
                                    {knownField.displayName} *
                                  </SelectItem>
                                ))}
                                <SelectItem value="divider-optional" disabled className="py-1 text-xs font-bold text-muted-foreground">
                                  Optional Fields
                                </SelectItem>
                                {knownFields.filter(f => !f.required).map((knownField) => (
                                  <SelectItem key={knownField.key} value={knownField.key}>
                                    {knownField.displayName}
                                  </SelectItem>
                                ))}
                                <SelectItem value="divider-custom" disabled className="py-1 text-xs font-bold text-muted-foreground">
                                  Custom
                                </SelectItem>
                                <SelectItem value={mapping.csvHeader}>
                                  Custom: "{mapping.csvHeader}"
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
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
