
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/app/AppContext';
import { Contact } from '@/lib/types';
import { parseCSV } from './csv/utils';
import FileUploadZone from './csv/FileUploadZone';
import FieldMappingForm from './csv/FieldMappingForm';
import ValidationSummary from './csv/ValidationSummary';
import ImportForm from './csv/ImportForm';

// Define a basic field mapping type
type FieldMapping = {
  csvHeader: string;
  mappedTo: string; 
};

const CSVUploader: React.FC = () => {
  const { uploadContacts } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // CSV data state
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<FieldMapping[]>([]);
  const [validContacts, setValidContacts] = useState<any[]>([]);
  const [invalidRows, setInvalidRows] = useState<any[]>([]);
  
  // Import state
  const [customImportName, setCustomImportName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isImported, setIsImported] = useState(false);
  
  // This will store the mapped contact IDs after successful validation
  const [validContactIds, setValidContactIds] = useState<string[]>([]);
  
  // File handling functions
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    await processFile(selectedFile);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    
    await processFile(droppedFile);
  };
  
  const processFile = async (selectedFile: File) => {
    // Reset states
    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setValidContacts([]);
    setInvalidRows([]);
    setIsImported(false);
    
    // Check if the file is a CSV
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      setIsProcessing(false);
      return;
    }
    
    try {
      // Parse the CSV file with a file reader
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const csvText = e.target?.result as string;
        
        // Call the parseCSV function with the text content of the file
        try {
          const result = parseCSV(csvText);
          
          // For simplicity, we'll consider all rows as valid for now
          // In a real implementation, you'd validate each row
          const parsedContacts = result.contacts;
          setHeaders(result.headers);
          
          // Generate some basic field mappings from headers
          const suggestedMappings = result.headers.map(header => ({
            csvHeader: header,
            mappedTo: header.toLowerCase().includes('email') ? 'email' :
                     header.toLowerCase().includes('name') ? 'name' :
                     header.toLowerCase().includes('company') ? 'company' : ''
          }));
          
          setMappings(suggestedMappings);
          
          // Simple validation - just check if email exists
          const valid = parsedContacts.filter(contact => 
            contact.email && contact.email.includes('@')
          );
          
          const invalid = parsedContacts.filter(contact => 
            !contact.email || !contact.email.includes('@')
          );
          
          setValidContacts(valid);
          setInvalidRows(invalid);
          
          // Generate IDs for valid contacts
          if (valid.length > 0) {
            const contactIds = valid.map(() => 
              `contact-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            );
            setValidContactIds(contactIds);
          }
          
        } catch (err) {
          setError(`Error parsing CSV: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          setIsProcessing(false);
        }
      };
      
      fileReader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      
      fileReader.readAsText(selectedFile);
      
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : String(err)}`);
      setIsProcessing(false);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setHeaders([]);
    setMappings([]);
    setValidContacts([]);
    setInvalidRows([]);
    setIsImported(false);
    setValidContactIds([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUploadToSystem = async () => {
    if (validContacts.length === 0 || !file) return;
    
    setIsUploading(true);
    
    try {
      // Map the validated data into Contact objects
      const contactsToUpload: Contact[] = validContacts.map((csvRow, index) => {
        const id = validContactIds[index] || `contact-${Date.now()}-${index}`;
        
        const contact: Contact = {
          id,
          name: `${csvRow.firstName || ''} ${csvRow.lastName || ''}`.trim(),
          phoneNumber: csvRow.phone || '',
          email: csvRow.email || '',
          linkedinUrl: csvRow.linkedIn || csvRow.linkedin || '',
          company: csvRow.company || '',
          position: csvRow.jobTitle || csvRow.job_title || '',
          tags: [],
          source: {
            type: 'csv',
            name: customImportName,
            importedAt: new Date(),
            batchId: `import-${Date.now()}`
          }
        };
        
        return contact;
      });
      
      // Upload contacts to the system
      uploadContacts(contactsToUpload, {
        type: 'csv',
        name: customImportName,
        filename: file.name
      });
      
      setIsImported(true);
    } catch (err) {
      setError(`Error uploading contacts: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="csv">
          <TabsList className="mb-4">
            <TabsTrigger value="csv">Upload CSV</TabsTrigger>
            <TabsTrigger value="manual" disabled>Manual Entry</TabsTrigger>
            <TabsTrigger value="api" disabled>API Import</TabsTrigger>
          </TabsList>
          
          <TabsContent value="csv" className="space-y-4">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            
            <FileUploadZone
              file={file}
              error={error}
              isDragging={isDragging}
              validCount={validContacts.length}
              invalidCount={invalidRows.length}
              validContactIds={validContactIds}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onBrowseClick={handleBrowseClick}
              onClearFile={handleClearFile}
            />
            
            {isProcessing && (
              <div className="text-center py-4">
                <div className="animate-pulse">Processing file...</div>
              </div>
            )}
            
            {(validContacts.length > 0 || invalidRows.length > 0) && !isProcessing && (
              <div className="space-y-6">
                {!isImported ? (
                  <>
                    {headers.length > 0 && (
                      <FieldMappingForm
                        mappings={mappings.map(m => ({
                          field: m.mappedTo,
                          header: m.csvHeader,
                        }))}
                        onMappingChange={(newMappings) => {
                          setMappings(newMappings.map(m => ({
                            csvHeader: m.header,
                            mappedTo: m.field,
                          })));
                        }}
                      />
                    )}
                    
                    <ValidationSummary
                      validCount={validContacts.length}
                      invalidCount={invalidRows.length}
                      headers={headers}
                      invalidRows={invalidRows}
                    />
                    
                    <ImportForm
                      customImportName={customImportName}
                      isUploading={isUploading}
                      contactCount={validContacts.length}
                      validContactIds={validContactIds}
                      onNameChange={setCustomImportName}
                      onUpload={handleUploadToSystem}
                    />
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                    ✅ {validContacts.length} contacts successfully imported
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CSVUploader;
