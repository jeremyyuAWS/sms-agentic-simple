
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact } from '@/lib/types';
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

// Added validation interface
interface ValidationResult {
  rowIndex: number;
  valid: boolean;
  errors: string[];
  rawData: string[];
}

// Function to parse CSV
const parseCSV = (csvText: string): { 
  headers: string[]; 
  contacts: Contact[];
  validationResults: ValidationResult[];
} => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const contacts: Contact[] = [];
  const validationResults: ValidationResult[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(value => value.trim());
    const rowErrors: string[] = [];
    
    // Check if row has correct number of columns
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
    let hasName = false;
    let hasPhone = false;
    
    headers.forEach((header, index) => {
      const value = values[index];
      const lowerHeader = header.toLowerCase();
      
      if (lowerHeader.includes('name')) {
        if (!value) {
          rowErrors.push('Name field is empty');
        } else {
          contact.name = value;
          hasName = true;
        }
      } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
        if (!value) {
          rowErrors.push('Phone field is empty');
        } else {
          // Basic phone validation
          const cleanedNumber = value.replace(/[\s\(\)\-\.]/g, '');
          if (!/^\+?\d{10,15}$/.test(cleanedNumber)) {
            rowErrors.push(`Invalid phone number format: "${value}"`);
          } else {
            contact.phoneNumber = value;
            hasPhone = true;
          }
        }
      } else if (lowerHeader.includes('email')) {
        if (value && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          rowErrors.push(`Invalid email format: "${value}"`);
        } else {
          contact.email = value;
        }
      } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
        contact.company = value;
      } else if (lowerHeader.includes('position') || lowerHeader.includes('title') || lowerHeader.includes('role')) {
        contact.position = value;
      } else {
        // Store other fields
        contact[header] = value;
      }
    });
    
    // Check required fields
    if (!hasName) {
      rowErrors.push('Missing name field');
    }
    
    if (!hasPhone) {
      rowErrors.push('Missing phone field');
    }
    
    // Only add if validation passed
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
  
  return { headers, contacts, validationResults };
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    
    // Set initial import name based on file name (without extension)
    const fileName = file.name.split('.')[0];
    setCustomImportName(fileName);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const { headers, contacts: parsedContacts, validationResults } = parseCSV(content);
        
        setHeaders(headers);
        setValidationResults(validationResults);
        
        if (parsedContacts.length === 0) {
          setError('No valid contacts found in the CSV. Make sure it has name and phone columns.');
          setContacts([]);
        } else {
          setContacts(parsedContacts);
        }
        
        // Show detailed results in toast
        const invalidRows = validationResults.filter(r => !r.valid);
        if (invalidRows.length > 0) {
          toast({
            title: `${invalidRows.length} invalid rows detected`,
            description: "See validation details below for more information",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while parsing the CSV file.');
        setContacts([]);
      }
    };
    reader.readAsText(file);
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
    
    // Pass file info and custom name
    onContactsUploaded(contacts, {
      type: 'csv',
      name: file?.name || 'CSV Import',
      filename: file?.name,
      customName: customImportName // Add the custom name here
    });
    
    setIsUploading(false);
    setFile(null);
    setContacts([]);
    setCustomImportName('');
    setHeaders([]);
    setValidationResults([]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validRows = validationResults.filter(r => r.valid).length;
  const invalidRows = validationResults.filter(r => !r.valid).length;

  return (
    <div className="space-y-6">
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

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Validation Results */}
      {file && validationResults.length > 0 && (
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
                            // Find corresponding contact
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

      {file && contacts.length > 0 && (
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
