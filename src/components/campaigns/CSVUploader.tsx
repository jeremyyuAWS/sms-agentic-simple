
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileType2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { Contact } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { useToast } from '@/hooks/use-toast';

const CSVUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadContacts } = useApp();
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

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      processFile(droppedFile);
    } else {
      setError('Please drop a CSV file.');
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
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const rows = content.split('\n');
        
        if (rows.length <= 1) {
          setError('The CSV file appears to be empty or contain only headers.');
          return;
        }
        
        const headers = rows[0].split(',').map(header => header.trim());
        
        // Check if required fields exist
        const requiredFields = ['name', 'phoneNumber'];
        const missingFields = requiredFields.filter(field => 
          !headers.some(header => header.toLowerCase() === field.toLowerCase())
        );
        
        if (missingFields.length > 0) {
          setError(`Missing required field(s): ${missingFields.join(', ')}`);
          return;
        }
        
        setHeaders(headers);
        
        // Parse the contacts
        const contacts: Contact[] = [];
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const values = rows[i].split(',').map(value => value.trim());
          
          if (values.length !== headers.length) {
            setError(`Row ${i} has ${values.length} columns, expected ${headers.length}.`);
            return;
          }
          
          const contact: any = { id: `temp-${i}` };
          for (let j = 0; j < headers.length; j++) {
            const field = headers[j].toLowerCase();
            const value = values[j];
            
            if (field === 'attendingconference' || field === 'attending conference') {
              contact[field] = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes' || value.toLowerCase() === 'y';
            } else {
              contact[field] = value;
            }
          }
          
          contacts.push(contact as Contact);
        }
        
        setContacts(contacts);
      } catch (err) {
        setError('An error occurred while parsing the CSV file.');
        console.error(err);
      }
    };
    
    reader.onerror = () => {
      setError('An error occurred while reading the file.');
    };
    
    reader.readAsText(file);
  };

  const handleUpload = () => {
    if (contacts.length === 0) {
      setError('No contacts to upload.');
      return;
    }
    
    setIsUploading(true);
    
    // Simulate network request
    setTimeout(() => {
      uploadContacts(contacts);
      setIsUploading(false);
      setFile(null);
      setContacts([]);
      setHeaders([]);
      
      toast({
        title: "Upload Successful",
        description: `${contacts.length} contacts have been added to your database.`,
      });
    }, 1500);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-5">
      <AnimatedCard
        className={cn(
          'border-2 border-dashed p-8 text-center transition-all',
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
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileType2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB • {contacts.length} contacts detected
                </p>
              </div>
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
              <div className="text-xs text-muted-foreground">
                CSV must include name and phoneNumber columns
              </div>
            </>
          )}
        </div>
      </AnimatedCard>
      
      {error && (
        <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
      
      {file && headers.length > 0 && !error && (
        <>
          <AnimatedCard>
            <h3 className="font-medium text-lg mb-4">CSV File Preview</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 gap-2 bg-muted p-3 border-b">
                {headers.slice(0, 3).map((header, index) => (
                  <div key={index} className="font-medium text-sm">
                    {header}
                  </div>
                ))}
                {headers.length > 3 && (
                  <div className="font-medium text-sm text-muted-foreground">
                    +{headers.length - 3} more fields
                  </div>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto">
                {contacts.slice(0, 5).map((contact, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 p-3 border-b last:border-b-0">
                    {headers.slice(0, 3).map((header, headerIndex) => (
                      <div key={headerIndex} className="text-sm truncate">
                        {(contact as any)[header]}
                      </div>
                    ))}
                  </div>
                ))}
                {contacts.length > 5 && (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    +{contacts.length - 5} more contacts
                  </div>
                )}
              </div>
            </div>
          </AnimatedCard>
          
          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? (
                <>
                  <span className="animate-pulse mr-2">Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Upload {contacts.length} Contacts
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CSVUploader;
