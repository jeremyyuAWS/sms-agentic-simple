
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contact } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

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

// Function to parse CSV
const parseCSV = (csvText: string): { headers: string[]; contacts: Contact[] } => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const contacts: Contact[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',').map(value => value.trim());
    if (values.length !== headers.length) continue;
    
    const contact: any = { id: `contact-${Date.now()}-${i}` };
    
    headers.forEach((header, index) => {
      const value = values[index];
      const lowerHeader = header.toLowerCase();
      
      if (lowerHeader.includes('name')) {
        contact.name = value;
      } else if (lowerHeader.includes('phone') || lowerHeader.includes('mobile')) {
        contact.phoneNumber = value;
      } else if (lowerHeader.includes('email')) {
        contact.email = value;
      } else if (lowerHeader.includes('company') || lowerHeader.includes('organization')) {
        contact.company = value;
      } else if (lowerHeader.includes('position') || lowerHeader.includes('title') || lowerHeader.includes('role')) {
        contact.position = value;
      } else {
        // Store other fields
        contact[header] = value;
      }
    });
    
    // Only add if it has at least name and phone
    if (contact.name && contact.phoneNumber) {
      contacts.push(contact as Contact);
    }
  }
  
  return { headers, contacts };
};

const CSVUploader: React.FC<CSVUploaderProps> = ({ onContactsUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [customImportName, setCustomImportName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
        const { headers, contacts: parsedContacts } = parseCSV(content);
        
        if (parsedContacts.length === 0) {
          setError('No valid contacts found in the CSV. Make sure it has name and phone columns.');
          setContacts([]);
        } else {
          setContacts(parsedContacts);
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
                <span className="font-medium">{contacts.length} contacts detected</span>
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
