import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact, FieldMapping } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface CSVUploaderProps {
  onContactsUploaded: (
    contacts: Contact[], 
    source: { 
      type: 'csv' | 'manual' | 'import' | 'api';
      name: string;
      filename?: string;
      customName?: string;
    }
  ) => void;
}

interface ValidationResult {
  rowIndex: number;
  valid: boolean;
  errors: string[];
  rawData: string[];
}

interface CSVField {
  key: string;
  displayName: string;
  synonyms: string[];
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
  formatExample?: string;
}

const knownFields: CSVField[] = [
  {
    key: 'name',
    displayName: 'Name',
    synonyms: ['full name', 'contact name', 'person', 'customer', 'client', 'first name', 'firstname', 'first', 'last name', 'lastname', 'last'],
    required: true,
    validator: (value) => !!value.trim(),
    errorMessage: 'Name is required',
    formatExample: 'John Smith'
  },
  {
    key: 'phoneNumber',
    displayName: 'Phone Number',
    synonyms: ['phone', 'telephone', 'cell', 'mobile', 'contact number', 'tel', 'cell phone', 'work phone', 'phone number', 'mobile number', 'cell number'],
    required: true,
    validator: (value) => {
      const cleanedNumber = value.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?\d{10,15}$/.test(cleanedNumber);
    },
    errorMessage: 'Invalid phone number format',
    formatExample: '(123) 456-7890'
  },
  {
    key: 'email',
    displayName: 'Email',
    synonyms: ['e-mail', 'mail', 'email address', 'e-mail address', 'electronic mail'],
    required: false,
    validator: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    errorMessage: 'Invalid email format',
    formatExample: 'example@email.com'
  },
  {
    key: 'company',
    displayName: 'Company',
    synonyms: ['organization', 'org', 'business', 'employer', 'firm', 'workplace', 'company name', 'corp', 'corporation', 'enterprise'],
    required: false,
    formatExample: 'Acme Corp'
  },
  {
    key: 'position',
    displayName: 'Position',
    synonyms: ['job title', 'title', 'role', 'job role', 'occupation', 'job', 'designation', 'profession'],
    required: false,
    formatExample: 'Marketing Manager'
  },
  {
    key: 'linkedinUrl',
    displayName: 'LinkedIn URL',
    synonyms: ['linkedin', 'linkedin profile', 'linkedin link', 'social profile', 'linkedin url'],
    required: false,
    validator: (value) => !value || /linkedin\.com\/in\/[\w\-\_]+/.test(value),
    errorMessage: 'Invalid LinkedIn URL',
    formatExample: 'https://linkedin.com/in/username'
  },
  {
    key: 'attendingConference',
    displayName: 'Attending Conference',
    synonyms: ['conference', 'attending', 'event attendance', 'will attend', 'conference attendance', 'rsvp'],
    required: false,
    validator: (value) => !value || /(yes|no|true|false|y|n|1|0)/i.test(value),
    formatExample: 'Yes/No/True/False'
  }
];

const fieldMappingSchema = z.object({
  fieldMappings: z.array(z.object({
    csvHeader: z.string(),
    mappedTo: z.string()
  }))
});

type FieldMappingFormValues = z.infer<typeof fieldMappingSchema>;

const scoreSimilarity = (header: string, field: CSVField): number => {
  const normalizedHeader = header.toLowerCase().trim();
  
  if (normalizedHeader === field.key) return 1;
  
  if (normalizedHeader === field.displayName.toLowerCase()) return 0.95;
  
  for (const synonym of field.synonyms) {
    if (normalizedHeader === synonym.toLowerCase()) return 0.9;
  }
  
  if (field.synonyms.some(syn => normalizedHeader.includes(syn.toLowerCase()))) return 0.7;
  if (normalizedHeader.includes(field.key.toLowerCase())) return 0.7;
  if (normalizedHeader.includes(field.displayName.toLowerCase())) return 0.7;
  
  if (field.synonyms.some(syn => syn.toLowerCase().includes(normalizedHeader))) return 0.5;
  
  return 0;
};

const guessFieldMappings = (headers: string[]): { csvHeader: string; mappedTo: string; confidence: number }[] => {
  return headers.map(header => {
    let bestMatch = { field: '' as string, score: 0 };
    
    knownFields.forEach(field => {
      const score = scoreSimilarity(header, field);
      if (score > bestMatch.score) {
        bestMatch = { field: field.key, score };
      }
    });
    
    return {
      csvHeader: header,
      mappedTo: bestMatch.score >= 0.5 ? bestMatch.field : '',
      confidence: bestMatch.score
    };
  });
};

const detectDataTypes = (headers: string[], sampleData: string[][]): { csvHeader: string; detectedType: string; sampleValue: string }[] => {
  return headers.map((header, index) => {
    const values = sampleData.map(row => row[index]).filter(val => val);
    
    if (values.length === 0) return { csvHeader: header, detectedType: 'unknown', sampleValue: '' };
    
    const sampleValue = values[0];
    
    if (values.some(val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val))) {
      return { csvHeader: header, detectedType: 'email', sampleValue };
    }
    
    if (values.some(val => {
      const cleaned = val.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?\d{10,15}$/.test(cleaned);
    })) {
      return { csvHeader: header, detectedType: 'phone', sampleValue };
    }
    
    if (values.some(val => /linkedin\.com\/in\/[\w\-\_]+/.test(val))) {
      return { csvHeader: header, detectedType: 'url', sampleValue };
    }
    
    if (values.every(val => /(yes|no|true|false|y|n|1|0)/i.test(val))) {
      return { csvHeader: header, detectedType: 'boolean', sampleValue };
    }
    
    return { csvHeader: header, detectedType: 'text', sampleValue };
  });
};

const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`;
  } else {
    return digits.length > 10 && !phone.includes('+') ? `+${digits}` : phone;
  }
};

const standardizeBoolean = (value: string): boolean => {
  const normalizedValue = value.toLowerCase().trim();
  return ['yes', 'true', 'y', '1'].includes(normalizedValue);
};

const parseCSV = (
  csvText: string, 
  fieldMappings: { csvHeader: string; mappedTo: string }[]
): { 
  headers: string[]; 
  contacts: Contact[];
  validationResults: ValidationResult[];
  typeInfo: { csvHeader: string; detectedType: string; sampleValue: string }[];
} => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const sampleRows = lines.slice(1, Math.min(6, lines.length))
    .map(line => line.split(',').map(value => value.trim()))
    .filter(row => row.length === headers.length);
  
  const typeInfo = detectDataTypes(headers, sampleRows);
  
  const contacts: Contact[] = [];
  const validationResults: ValidationResult[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(value => value.trim());
    const rowErrors: string[] = [];
    
    if (values.length !== headers.length) {
      rowErrors.push(`Column count mismatch: expected ${headers.length}, got ${values.length}`);
      validationResults.push({
        rowIndex: i,
        valid: false,
        errors: rowErrors,
        rawData: values
      });
      continue;
    }
    
    const contact: any = { id: `contact-${Date.now()}-${i}` };
    
    fieldMappings.forEach(mapping => {
      if (!mapping.mappedTo) return;
      
      const headerIndex = headers.findIndex(h => h === mapping.csvHeader);
      if (headerIndex === -1) return;
      
      const value = values[headerIndex];
      const fieldDef = knownFields.find(f => f.key === mapping.mappedTo);
      
      if (fieldDef) {
        if (fieldDef.required && !value) {
          rowErrors.push(`Required field ${fieldDef.displayName} is empty`);
        } else if (value && fieldDef.validator && !fieldDef.validator(value)) {
          rowErrors.push(fieldDef.errorMessage || `Invalid ${fieldDef.displayName} format`);
        } else if (value) {
          if (mapping.mappedTo === 'phoneNumber') {
            contact[mapping.mappedTo] = formatPhoneNumber(value);
          } else if (mapping.mappedTo === 'attendingConference') {
            contact[mapping.mappedTo] = standardizeBoolean(value);
          } else {
            contact[mapping.mappedTo] = value;
          }
        }
      } else {
        contact[mapping.mappedTo] = value;
      }
    });
    
    const hasName = !!contact.name;
    const hasPhone = !!contact.phoneNumber;
    
    if (!hasName) rowErrors.push('Missing name field');
    if (!hasPhone) rowErrors.push('Missing phone field');
    
    const isValid = rowErrors.length === 0 && hasName && hasPhone;
    
    if (isValid) {
      contacts.push(contact as Contact);
    }
    
    validationResults.push({
      rowIndex: i,
      valid: isValid,
      errors: rowErrors,
      rawData: values
    });
  }
  
  return { headers, contacts, validationResults, typeInfo };
};

const CSVUploader: React.FC<CSVUploaderProps> = ({ onContactsUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [customImportName, setCustomImportName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [typeInfo, setTypeInfo] = useState<{ csvHeader: string; detectedType: string; sampleValue: string }[]>([]);
  const [showMappingInterface, setShowMappingInterface] = useState(false);
  const [csvText, setCsvText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<FieldMappingFormValues>({
    resolver: zodResolver(fieldMappingSchema),
    defaultValues: {
      fieldMappings: []
    }
  });

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    if (!file || file.type !== 'text/csv') {
      setError('Please select a CSV file.');
      return;
    }

    setFile(file);
    setError(null);
    
    const fileName = file.name.split('.')[0];
    setCustomImportName(fileName);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setCsvText(content);
        
        const lines = content.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        setHeaders(headers);
        
        const suggestedMappings = guessFieldMappings(headers);
        
        const sampleRows = lines.slice(1, Math.min(6, lines.length))
          .map(line => line.split(',').map(value => value.trim()))
          .filter(row => row.length === headers.length);
        
        const typeInfo = detectDataTypes(headers, sampleRows);
        setTypeInfo(typeInfo);
        
        form.reset({
          fieldMappings: suggestedMappings.map(mapping => ({
            csvHeader: mapping.csvHeader,
            mappedTo: mapping.mappedTo
          }))
        });
        
        setShowMappingInterface(true);
      } catch (err) {
        console.error(err);
        setError('An error occurred while parsing the CSV file.');
        setContacts([]);
      }
    };
    reader.readAsText(file);
  };

  const processWithMappings = (mappings: { csvHeader: string; mappedTo: string }[]) => {
    try {
      const { contacts: parsedContacts, validationResults, typeInfo } = parseCSV(csvText, mappings);
      
      setValidationResults(validationResults);
      setTypeInfo(typeInfo);
      
      if (parsedContacts.length === 0) {
        setError('No valid contacts found in the CSV. Make sure it has name and phone columns.');
        setContacts([]);
      } else {
        setContacts(parsedContacts);
        setShowMappingInterface(false);
      }
      
      const invalidRows = validationResults.filter(r => !r.valid);
      if (invalidRows.length > 0) {
        toast({
          title: `${invalidRows.length} invalid rows detected`,
          description: "See validation details below for more information",
          variant: "destructive",
        });
      } else {
        toast({
          title: `${parsedContacts.length} valid contacts ready to import`,
          description: "All rows passed validation",
        });
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while processing the CSV file.');
      setContacts([]);
    }
  };

  const handleSubmitMapping = (data: FieldMappingFormValues) => {
    processWithMappings(data.fieldMappings);
  };

  const handleUpload = () => {
    if (contacts.length === 0) {
      setError('No contacts to upload.');
      return;
    }
    
    if (!customImportName.trim()) {
      toast({
        title: "Import Name Required",
        description: "Please provide a name for this import to help identify these contacts later.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    onContactsUploaded(contacts, {
      type: 'csv',
      name: file?.name || 'CSV Import',
      filename: file?.name,
      customName: customImportName
    });
    
    setIsUploading(false);
    setFile(null);
    setContacts([]);
    setCustomImportName('');
    setHeaders([]);
    setValidationResults([]);
    setShowMappingInterface(false);
    setCsvText('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validRows = validationResults.filter(r => r.valid).length;
  const invalidRows = validationResults.filter(r => !r.valid).length;

  return (
    <div className="space-y-6">
      {!showMappingInterface && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all',
            isDragging ? 'border-primary bg-primary/5' : 'border-border',
            error && 'border-destructive/50 bg-destructive/5'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <span className="font-medium">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setFile(null);
                    setContacts([]);
                    setError(null);
                    setCustomImportName('');
                    setHeaders([]);
                    setValidationResults([]);
                    setShowMappingInterface(false);
                    setCsvText('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {contacts.length > 0 && (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">{contacts.length} valid contacts detected</span>
                </div>
              )}
              
              {invalidRows > 0 && (
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{invalidRows} invalid rows found</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-medium">Drag and drop your CSV file here</h3>
              <p className="text-sm text-muted-foreground">
                or <button type="button" className="text-primary hover:underline" onClick={() => fileInputRef.current?.click()}>browse</button> to upload
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {showMappingInterface && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h3 className="font-medium text-lg">Map CSV Columns to Contact Fields</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowMappingInterface(false);
                setFile(null);
                setCsvText('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
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
            <form onSubmit={form.handleSubmit(handleSubmitMapping)} className="space-y-4">
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
        </Card>
      )}
      
      {file && validationResults.length > 0 && !showMappingInterface && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium text-lg">CSV Validation Results</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="text-sm text-muted-foreground">Valid Rows</div>
              <div className="text-xl font-semibold text-green-600">{validRows}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="text-sm text-muted-foreground">Invalid Rows</div>
              <div className="text-xl font-semibold text-red-600">{invalidRows}</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div className="text-sm text-muted-foreground">Total Rows</div>
              <div className="text-xl font-semibold text-blue-600">{validationResults.length}</div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="invalid-rows">
              <AccordionTrigger>
                Invalid Rows ({invalidRows})
              </AccordionTrigger>
              <AccordionContent>
                {invalidRows > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row #</TableHead>
                          <TableHead>Errors</TableHead>
                          <TableHead>Raw Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults
                          .filter(result => !result.valid)
                          .map((result) => (
                            <TableRow key={result.rowIndex}>
                              <TableCell>{result.rowIndex}</TableCell>
                              <TableCell>
                                <ul className="list-disc list-inside text-sm text-red-600">
                                  {result.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </TableCell>
                              <TableCell className="font-mono text-xs">
                                {result.rawData.join(', ')}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No invalid rows found</p>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="valid-rows">
              <AccordionTrigger>
                Valid Rows ({validRows})
              </AccordionTrigger>
              <AccordionContent>
                {validRows > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Row #</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Other Fields</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResults
                          .filter(result => result.valid)
                          .map((result) => {
                            const contactIndex = contacts.findIndex(c => 
                              c.id.includes(`-${result.rowIndex}`) || result.rawData.includes(c.name)
                            );
                            const contact = contactIndex !== -1 ? contacts[contactIndex] : null;
                            
                            return (
                              <TableRow key={result.rowIndex}>
                                <TableCell>{result.rowIndex}</TableCell>
                                <TableCell>{contact?.name || '-'}</TableCell>
                                <TableCell>{contact?.phoneNumber || '-'}</TableCell>
                                <TableCell className="font-mono text-xs">
                                  {contact ? 
                                    Object.entries(contact)
                                      .filter(([key]) => !['id', 'name', 'phoneNumber'].includes(key))
                                      .map(([key, value]) => `${key}: ${value}`)
                                      .join(', ') 
                                    : '-'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No valid rows found</p>
                )}
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="detected-headers">
              <AccordionTrigger>
                Detected CSV Headers
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {headers.map((header, index) => (
                    <div key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                      {header}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}

      {file && contacts.length > 0 && !showMappingInterface && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="importName">Import Name (required)</Label>
            <Input
              id="importName"
              placeholder="Give this import a meaningful name (e.g., Conference Leads 2023)"
              value={customImportName}
              onChange={(e) => setCustomImportName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This name will help you identify these contacts when creating campaigns and contact lists
            </p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading || !customImportName.trim()}>
              {isUploading ? 'Uploading...' : `Upload ${contacts.length} contacts`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
