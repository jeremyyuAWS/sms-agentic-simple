
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X, Info, ArrowRight, Edit, PencilLine, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact, CSVField, FieldMapping } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface CSVUploaderProps {
  onContactsUploaded: (contacts: Contact[]) => void;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onContactsUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([]);
  const [showMappingDialog, setShowMappingDialog] = useState(false);
  const [sampleData, setSampleData] = useState<string[][]>([]);
  const [editingField, setEditingField] = useState<FieldMapping | null>(null);

  // Required fields for the CSV with synonyms for smart mapping
  const requiredFields: CSVField[] = [
    { 
      name: 'name', 
      description: 'Full name of the contact', 
      required: true, 
      example: 'John Doe', 
      synonyms: ['full name', 'contact name', 'first name', 'first and last name', 'customer name', 'client name'],
      validator: (value) => value.trim().length > 0
    },
    { 
      name: 'phoneNumber', 
      description: 'Phone number. Supports various formats: US format (555-111-1212), international with country code (+15551111212), with parentheses (555) 111-1212, or plain digits (5551111212)', 
      required: true, 
      example: '555-111-1212', 
      synonyms: ['phone', 'mobile', 'cell', 'telephone', 'contact number', 'mobile number', 'cell phone', 'phone no', 'tel'],
      validator: (value) => {
        // Accept multiple formats: 555-111-1212, (555) 111-1212, 5551111212, +15551111212
        const cleanedNumber = value.replace(/[\s\(\)\-\.]/g, '');
        return /^\+?\d{10,15}$/.test(cleanedNumber);
      }
    },
    { 
      name: 'email', 
      description: 'Email address', 
      required: false, 
      example: 'john@example.com', 
      synonyms: ['e-mail', 'mail', 'email address', 'contact email', 'work email', 'personal email'],
      validator: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())
    },
    { 
      name: 'linkedinUrl', 
      description: 'LinkedIn profile URL', 
      required: false, 
      example: 'https://linkedin.com/in/johndoe', 
      synonyms: ['linkedin', 'linkedin profile', 'linkedin url', 'linkedin link', 'social media', 'social profile'],
      validator: (value) => !value || value.includes('linkedin.com/')
    },
    { 
      name: 'attendingConference', 
      description: 'Is the contact attending a conference (Yes/No)', 
      required: false, 
      example: 'Yes', 
      synonyms: ['attending', 'conference', 'will attend', 'rsvp', 'confirmed', 'attending status', 'attendance'],
      validator: (value) => !value || ['yes', 'no', 'true', 'false', 'y', 'n', '1', '0'].includes(value.toLowerCase()),
      formatter: (value) => ['true', 'yes', 'y', '1'].includes(value.toLowerCase())
    },
    { 
      name: 'company', 
      description: 'Company or organization name', 
      required: false, 
      example: 'Acme Inc.', 
      synonyms: ['organization', 'org', 'employer', 'workplace', 'business', 'firm', 'corporation'],
      validator: (value) => !value || value.trim().length > 0
    },
    { 
      name: 'position', 
      description: 'Job title or position', 
      required: false, 
      example: 'Marketing Manager', 
      synonyms: ['job title', 'title', 'role', 'job role', 'designation', 'job position', 'occupation'],
      validator: (value) => !value || value.trim().length > 0
    }
  ];

  // Function to detect data type based on content
  const detectDataType = (values: string[]): string => {
    // Take a sample of non-empty values
    const sampleValues = values.filter(v => v.trim()).slice(0, 10);
    
    if (sampleValues.length === 0) return 'unknown';
    
    // Email detection
    if (sampleValues.every(v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v))) {
      return 'email';
    }
    
    // Phone number detection (updated pattern to include 555-111-1212 format)
    if (sampleValues.every(v => {
      const cleaned = v.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?\d{10,15}$/.test(cleaned);
    })) {
      return 'phone';
    }
    
    // URL detection
    if (sampleValues.every(v => v.startsWith('http') || v.includes('www.') || v.includes('.com/'))) {
      return 'url';
    }
    
    // Boolean detection
    if (sampleValues.every(v => ['yes', 'no', 'true', 'false', 'y', 'n', '1', '0'].includes(v.toLowerCase()))) {
      return 'boolean';
    }
    
    // Number detection
    if (sampleValues.every(v => !isNaN(Number(v)))) {
      return 'number';
    }
    
    // Date detection (simple check)
    if (sampleValues.every(v => !isNaN(Date.parse(v)))) {
      return 'date';
    }
    
    return 'text';
  };

  // Function to perform smart field mapping
  const performSmartMapping = (csvHeaders: string[], data: string[][]): FieldMapping[] => {
    const mappings: FieldMapping[] = [];
    
    // Create a sample of data for analysis (up to 5 rows)
    const dataSample = data.slice(0, 5);
    setSampleData(dataSample);
    
    csvHeaders.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      let bestMatch: CSVField | null = null;
      let highestConfidence = 0;
      
      // Get column values for data type detection
      const columnValues = data.map(row => row[index] || '');
      const detectedType = detectDataType(columnValues);
      
      // Check if the header exactly matches or is a synonym of any required field
      for (const field of requiredFields) {
        let confidence = 0;
        
        // Exact match gets highest confidence
        if (field.name.toLowerCase() === headerLower) {
          confidence = 1;
        } 
        // Check synonyms for partial matches
        else if (field.synonyms && field.synonyms.some(s => headerLower.includes(s.toLowerCase()))) {
          const synonym = field.synonyms.find(s => headerLower.includes(s.toLowerCase()));
          confidence = synonym ? 0.9 : 0;
        }
        // Content-based matching as a fallback
        else if ((field.name === 'email' && detectedType === 'email') ||
                (field.name === 'phoneNumber' && detectedType === 'phone') ||
                (field.name === 'linkedinUrl' && detectedType === 'url')) {
          confidence = 0.8;
        }
        
        if (confidence > highestConfidence) {
          highestConfidence = confidence;
          bestMatch = field;
        }
      }
      
      // Create mapping
      const mapping: FieldMapping = {
        csvHeader: header,
        mappedTo: bestMatch ? bestMatch.name : header,
        confidence: highestConfidence,
        sample: dataSample.length > 0 ? dataSample[0][index] : '',
        isCustomField: !bestMatch,
        dataType: detectedType as any
      };
      
      mappings.push(mapping);
    });
    
    return mappings;
  };

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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      processFile(droppedFile);
    } else {
      setError('Please drop a CSV file.');
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setError(null);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        if (rows.length <= 1) {
          setError('The CSV file appears to be empty or contain only headers.');
          toast({
            title: "Empty File",
            description: "The CSV file appears to be empty or contain only headers.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        // Get headers and normalize them
        const headers = rows[0].split(',').map(header => header.trim());
        setHeaders(headers);
        
        // Parse data rows for smart mapping
        const dataRows: string[][] = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          const values = parseCSVLine(rows[i]);
          if (values.length === headers.length) {
            dataRows.push(values);
          }
        }
        
        // Perform smart field mapping
        const mappings = performSmartMapping(headers, dataRows);
        setFieldMappings(mappings);
        
        // Check if any required fields are missing after mapping
        const missingFields = requiredFields
          .filter(field => field.required)
          .filter(field => !mappings.some(m => m.mappedTo === field.name));
        
        if (missingFields.length > 0) {
          setError(`Missing required field(s): ${missingFields.map(f => f.name).join(', ')}`);
          toast({
            title: "Missing Fields",
            description: `Your CSV is missing these required fields: ${missingFields.map(f => f.name).join(', ')}`,
            variant: "destructive"
          });
          setShowMappingDialog(true);
        } else if (mappings.some(m => m.confidence < 1)) {
          // If we have any uncertain mappings, show the dialog
          setShowMappingDialog(true);
        }
        
        setIsProcessing(false);
      } catch (err) {
        console.error(err);
        setError('An error occurred while parsing the CSV file.');
        toast({
          title: "Processing Error",
          description: "An error occurred while parsing the CSV file.",
          variant: "destructive"
        });
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('An error occurred while reading the file.');
      toast({
        title: "File Read Error",
        description: "An error occurred while reading the file.",
        variant: "destructive"
      });
      setIsProcessing(false);
    };
    
    reader.readAsText(file);
  };

  // Helper function to correctly parse CSV lines with quoted values
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  };

  const processContactsWithMapping = () => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        // Parse the contacts using our mapping
        const parsedContacts: Contact[] = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = parseCSVLine(rows[i]);
          
          if (values.length !== headers.length) {
            continue; // Skip malformed rows
          }
          
          const contact: any = { id: `temp-${i}` };
          let isValid = true;
          
          // Apply field mappings
          fieldMappings.forEach((mapping, index) => {
            const value = values[index].trim();
            
            // Skip empty values for required fields
            if (mapping.mappedTo === 'name' || mapping.mappedTo === 'phoneNumber') {
              if (!value) {
                isValid = false;
              }
            }
            
            // Find the field definition to apply validation and formatting
            const fieldDef = requiredFields.find(f => f.name === mapping.mappedTo);
            
            if (fieldDef && fieldDef.validator && !fieldDef.validator(value)) {
              // Skip invalid values based on validator
              isValid = false;
            } else if (fieldDef && fieldDef.formatter) {
              // Apply formatter if available
              contact[mapping.mappedTo] = fieldDef.formatter(value);
            } else {
              // Store the value as is
              contact[mapping.mappedTo] = value;
            }
          });
          
          if (isValid) {
            parsedContacts.push(contact as Contact);
          }
        }
        
        setContacts(parsedContacts);
        
        toast({
          title: "CSV Processed Successfully",
          description: `Found ${parsedContacts.length} valid contacts in your CSV file.`,
        });
        
        setShowMappingDialog(false);
      } catch (err) {
        console.error(err);
        toast({
          title: "Processing Error",
          description: "An error occurred while processing contacts with the mapping.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
  };

  const getFieldDescription = (fieldName: string): string => {
    const field = requiredFields.find(f => f.name === fieldName);
    return field ? field.description : "Custom field";
  };

  const handleUpload = () => {
    if (contacts.length === 0) {
      setError('No contacts to upload.');
      toast({
        title: "No Contacts",
        description: "There are no contacts to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Upload contacts
    setTimeout(() => {
      onContactsUploaded(contacts);
      setIsUploading(false);
      
      toast({
        title: "Upload Successful",
        description: `${contacts.length} contacts have been uploaded.`,
      });
      
      // Reset the form
      setFile(null);
      setContacts([]);
      setHeaders([]);
      setFieldMappings([]);
    }, 1000);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setFile(null);
    setContacts([]);
    setHeaders([]);
    setError(null);
    setFieldMappings([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateFieldMapping = (index: number, newMappedTo: string, description?: string) => {
    setFieldMappings(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        mappedTo: newMappedTo,
        description: description || updated[index].description,
        confidence: 1 // User manually set it
      };
      return updated;
    });
  };

  const openEditFieldDialog = (field: FieldMapping) => {
    setEditingField(field);
  };

  const saveFieldDescription = (description: string) => {
    if (!editingField) return;
    
    setFieldMappings(prev => {
      return prev.map(field => 
        field.csvHeader === editingField.csvHeader 
          ? { ...field, description: description }
          : field
      );
    });
    
    setEditingField(null);
  };

  const getDataTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      email: 'bg-blue-100 text-blue-800',
      phone: 'bg-green-100 text-green-800',
      url: 'bg-purple-100 text-purple-800',
      boolean: 'bg-yellow-100 text-yellow-800',
      number: 'bg-pink-100 text-pink-800',
      date: 'bg-indigo-100 text-indigo-800',
      text: 'bg-gray-100 text-gray-800',
      unknown: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${colors[type] || colors.unknown}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Required Fields Guide */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-blue-500" />
          <h3 className="font-medium">CSV File Requirements</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Your CSV file should include the following fields (headers must match exactly):
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Example</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requiredFields.map((field) => (
              <TableRow key={field.name}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>{field.required ? 'Yes' : 'No'}</TableCell>
                <TableCell>{field.description}</TableCell>
                <TableCell className="text-muted-foreground">{field.example}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-muted-foreground mt-3">
          Our smart field mapping will automatically detect and map your CSV columns to the appropriate fields.
        </p>
      </Card>

      {/* File Upload Area */}
      <Card
        className={cn(
          'border-2 border-dashed p-8 text-center transition-all relative',
          isDragging ? 'border-primary bg-primary/5' : 'border-border',
          (error && !file) && 'border-destructive/50 bg-destructive/5'
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
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {file ? (
            <>
              <div className="flex items-center justify-between w-full max-w-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClearFile} 
                  className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {isProcessing ? (
                <div className="text-center py-4">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Processing CSV file...</p>
                </div>
              ) : contacts.length > 0 ? (
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{contacts.length} contacts detected</span>
                </div>
              ) : null}
              
              {fieldMappings.length > 0 && !isProcessing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setShowMappingDialog(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Review Field Mapping
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Drop your CSV file here</h3>
                <p className="text-sm text-muted-foreground">
                  or <button className="text-primary hover:underline" onClick={handleOpenFileDialog}>select a file</button> from your computer
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {/* Field Mapping Dialog */}
      <Dialog open={showMappingDialog} onOpenChange={setShowMappingDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Smart Field Mapping</DialogTitle>
            <DialogDescription>
              We've analyzed your CSV and mapped the columns to our contact fields. Please review and adjust if needed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CSV Column</TableHead>
                  <TableHead>Detected Type</TableHead>
                  <TableHead>Sample Data</TableHead>
                  <TableHead>Maps To</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{mapping.csvHeader}</TableCell>
                    <TableCell>{getDataTypeBadge(mapping.dataType || 'unknown')}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{mapping.sample}</TableCell>
                    <TableCell>
                      <Select 
                        defaultValue={mapping.mappedTo} 
                        onValueChange={(value) => updateFieldMapping(index, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select field" />
                        </SelectTrigger>
                        <SelectContent>
                          {requiredFields.map((field) => (
                            <SelectItem key={field.name} value={field.name}>
                              {field.name} {field.required && <span className="text-red-500">*</span>}
                            </SelectItem>
                          ))}
                          <SelectItem value={mapping.csvHeader}>
                            Custom: {mapping.csvHeader}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {mapping.confidence === 1 ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          High
                        </Badge>
                      ) : mapping.confidence >= 0.8 ? (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                          Medium
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                          Low
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditFieldDialog(mapping)}
                      >
                        <PencilLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowMappingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={processContactsWithMapping}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Apply Mapping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Field Description Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Field</DialogTitle>
            <DialogDescription>
              Add a description for this field or change its mapping.
            </DialogDescription>
          </DialogHeader>
          
          {editingField && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fieldName">CSV Column Name</Label>
                <Input id="fieldName" value={editingField.csvHeader} readOnly disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mappedField">Maps To</Label>
                <Select 
                  defaultValue={editingField.mappedTo} 
                  onValueChange={(value) => {
                    if (editingField) {
                      const index = fieldMappings.findIndex(m => m.csvHeader === editingField.csvHeader);
                      if (index !== -1) {
                        updateFieldMapping(index, value);
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {requiredFields.map((field) => (
                      <SelectItem key={field.name} value={field.name}>
                        {field.name} {field.required && <span className="text-red-500">*</span>}
                      </SelectItem>
                    ))}
                    <SelectItem value={editingField.csvHeader}>
                      Custom: {editingField.csvHeader}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Field Description</Label>
                <Input 
                  id="description" 
                  placeholder="Enter a description for this field" 
                  defaultValue={editingField.description || getFieldDescription(editingField.mappedTo)}
                  onChange={(e) => {
                    if (editingField) {
                      setEditingField({
                        ...editingField,
                        description: e.target.value
                      });
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sample Data</Label>
                <div className="p-2 bg-muted rounded text-sm">
                  {editingField.sample || 'No sample data available'}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingField(null)}>
              Cancel
            </Button>
            <Button onClick={() => saveFieldDescription(editingField?.description || '')}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Contact Preview */}
      {file && headers.length > 0 && contacts.length > 0 && !error && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">Contact Preview</h3>
            <p className="text-sm text-muted-foreground">
              Showing {Math.min(5, contacts.length)} of {contacts.length} contacts
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {fieldMappings
                    .filter(m => !m.isCustomField || requiredFields.some(rf => rf.name === m.mappedTo))
                    .map((mapping, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {mapping.mappedTo}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {mapping.description || getFieldDescription(mapping.mappedTo)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.slice(0, 5).map((contact, index) => (
                  <TableRow key={index}>
                    {fieldMappings
                      .filter(m => !m.isCustomField || requiredFields.some(rf => rf.name === m.mappedTo))
                      .map((mapping, headerIndex) => (
                      <TableCell key={headerIndex} className="whitespace-nowrap">
                        {contact[mapping.mappedTo] !== undefined ? 
                          typeof contact[mapping.mappedTo] === 'boolean' 
                            ? contact[mapping.mappedTo] ? 'Yes' : 'No'
                            : contact[mapping.mappedTo]
                          : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {contacts.length > 5 && (
            <div className="p-3 text-center text-sm text-muted-foreground border-t">
              {contacts.length - 5} more contacts not shown
            </div>
          )}
        </Card>
      )}
      
      {/* Upload Button */}
      {contacts.length > 0 && !error && (
        <div className="flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload {contacts.length} Contacts</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
