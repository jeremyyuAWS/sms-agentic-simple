
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact } from '@/lib/types';
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

interface CSVUploaderProps {
  onContactsUploaded: (contacts: Contact[]) => void;
}

interface CSVField {
  name: string;
  description: string;
  required: boolean;
  example?: string;
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

  // Required fields for the CSV
  const requiredFields: CSVField[] = [
    { name: 'name', description: 'Full name of the contact', required: true, example: 'John Doe' },
    { name: 'phoneNumber', description: 'Phone number (E.164 format preferred)', required: true, example: '+15551234567' },
    { name: 'email', description: 'Email address', required: false, example: 'john@example.com' },
    { name: 'linkedinUrl', description: 'LinkedIn profile URL', required: false, example: 'https://linkedin.com/in/johndoe' },
    { name: 'attendingConference', description: 'Is the contact attending a conference (Yes/No)', required: false, example: 'Yes' }
  ];

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
        const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
        setHeaders(headers);
        
        // Check if required fields exist
        const missingFields = requiredFields
          .filter(field => field.required)
          .filter(field => !headers.includes(field.name.toLowerCase()));
        
        if (missingFields.length > 0) {
          setError(`Missing required field(s): ${missingFields.map(f => f.name).join(', ')}`);
          toast({
            title: "Missing Fields",
            description: `Your CSV is missing these required fields: ${missingFields.map(f => f.name).join(', ')}`,
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }
        
        // Parse the contacts
        const parsedContacts: Contact[] = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          // Use a CSV parser that handles quoted values with commas
          const values = parseCSVLine(rows[i]);
          
          if (values.length !== headers.length) {
            setError(`Row ${i} has ${values.length} columns, expected ${headers.length}.`);
            toast({
              title: "CSV Format Error",
              description: `Row ${i} has ${values.length} columns, expected ${headers.length}.`,
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          
          const contact: any = { id: `temp-${i}` };
          for (let j = 0; j < headers.length; j++) {
            const field = headers[j];
            const value = values[j].trim();
            
            if (field === 'attendingconference' || field === 'attending conference') {
              contact[field] = ['true', 'yes', 'y', '1'].includes(value.toLowerCase());
            } else {
              contact[field] = value;
            }
          }
          
          parsedContacts.push(contact as Contact);
        }
        
        setContacts(parsedContacts);
        setIsProcessing(false);
        
        toast({
          title: "CSV Processed Successfully",
          description: `Found ${parsedContacts.length} contacts in your CSV file.`,
        });
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
                  {headers.map((header, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {header}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {requiredFields.find(f => f.name.toLowerCase() === header.toLowerCase())?.description || `Custom field: ${header}`}
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
                    {headers.map((header, headerIndex) => (
                      <TableCell key={headerIndex} className="whitespace-nowrap">
                        {(contact as any)[header]}
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
