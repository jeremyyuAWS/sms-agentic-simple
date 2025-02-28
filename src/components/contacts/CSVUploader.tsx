
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/app/AppContext';
import { Contact } from '@/lib/types';
import { validateCSV, parseCSV, getColumnMappingSuggestions } from './csv/utils';
import FileUploadZone from './csv/FileUploadZone';
import FieldMappingForm from './csv/FieldMappingForm';
import ValidationSummary from './csv/ValidationSummary';
import ImportForm from './csv/ImportForm';
import { ColumnMapping, ContactCSVRow, ValidationResult } from './csv/types';
import { defaultMappings } from './csv/fields-definition';

const CSVUploader: React.FC = () => {
  const { uploadContacts } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // CSV data state
  const [rawData, setRawData] = useState<ContactCSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>(defaultMappings);
  const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
  
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
    setValidationResults(null);
    setIsImported(false);
    
    // Check if the file is a CSV
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      setIsProcessing(false);
      return;
    }
    
    try {
      // Parse the CSV file
      const result = await parseCSV(selectedFile);
      setRawData(result.data);
      setHeaders(result.headers);
      
      // Generate mapping suggestions
      const suggestions = getColumnMappingSuggestions(result.headers);
      setMappings(suggestions);
      
      // Validate the data with the suggested mappings
      const validationResult = validateCSV(result.data, suggestions);
      setValidationResults(validationResult);
      
      // If there are valid contacts, create IDs for them
      if (validationResult.validContacts.length > 0) {
        const contactIds = validationResult.validContacts.map(() => `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
        setValidContactIds(contactIds);
      }
      
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setRawData([]);
    setHeaders([]);
    setMappings(defaultMappings);
    setValidationResults(null);
    setIsImported(false);
    setValidContactIds([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUploadToSystem = async () => {
    if (!validationResults || !file) return;
    
    setIsUploading(true);
    
    try {
      // Map the validated CSV data into Contact objects
      const contactsToUpload: Contact[] = validationResults.validContacts.map((csvRow, index) => {
        const id = validContactIds[index] || `contact-${Date.now()}-${index}`;
        
        const contact: Contact = {
          id,
          email: csvRow.email || '',
          firstName: csvRow.firstName || '',
          lastName: csvRow.lastName || '',
          company: csvRow.company || '',
          jobTitle: csvRow.jobTitle || '',
          phone: csvRow.phone || '',
          country: csvRow.country || '',
          state: csvRow.state || '',
          city: csvRow.city || '',
          lastContacted: null,
          tags: [],
          lists: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          importBatchId: `import-${Date.now()}`,
          source: 'csv',
          notes: csvRow.notes || '',
          linkedIn: csvRow.linkedIn || '',
          twitter: csvRow.twitter || '',
          status: 'active',
          unsubscribed: false
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
              validCount={validationResults?.validContacts.length || 0}
              invalidCount={validationResults?.invalidRows.length || 0}
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
            
            {validationResults && !isProcessing && (
              <div className="space-y-6">
                {!isImported ? (
                  <>
                    <FieldMappingForm
                      headers={headers}
                      mappings={mappings}
                      setMappings={setMappings}
                    />
                    
                    <ValidationSummary
                      validCount={validationResults.validContacts.length}
                      invalidCount={validationResults.invalidRows.length}
                      headers={headers}
                      invalidRows={validationResults.invalidRows}
                    />
                    
                    <ImportForm
                      customImportName={customImportName}
                      isUploading={isUploading}
                      contactCount={validationResults.validContacts.length}
                      validContactIds={validContactIds}
                      onNameChange={setCustomImportName}
                      onUpload={handleUploadToSystem}
                    />
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
                    ✅ {validationResults.validContacts.length} contacts successfully imported
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
