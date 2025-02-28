
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
import { Info } from 'lucide-react';

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

  const handleSubmit = (data: FieldMappingFormValues) => {
    // Ensure all items in the array are FieldMappingItems (both fields are required)
    const validatedMappings: FieldMappingItem[] = data.fieldMappings.map(item => ({
      csvHeader: item.csvHeader,
      mappedTo: item.mappedTo
    }));
    
    onSubmit(validatedMappings);
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
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="font-medium">{mapping.csvHeader}</div>
                        <div className="text-xs text-muted-foreground">
                          Detected: {headerInfo?.detectedType || 'unknown'}
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
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">-- Ignore this column --</SelectItem>
                                {knownFields.map((knownField) => (
                                  <SelectItem key={knownField.key} value={knownField.key}>
                                    {knownField.displayName}
                                    {knownField.required && " *"}
                                  </SelectItem>
                                ))}
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
            <Button type="submit">Apply Mapping</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FieldMappingForm;
