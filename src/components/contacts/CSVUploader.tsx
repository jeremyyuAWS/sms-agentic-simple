
import React, { useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Contact } from '@/lib/types';

// Import refactored components
import FileUploadZone from './csv/FileUploadZone';
import FieldMappingForm from './csv/FieldMappingForm';
import ValidationSummary from './csv/ValidationSummary';
import ImportForm from './csv/ImportForm';
import { parseCSV, guessFieldMappings } from './csv/utils';
import { FieldMappingItem, TypeInfo, ValidationResult, CSVUploaderProps } from './csv/types';

const CSVUploader: React.FC<CSVUploaderProps> = ({ onContactsUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [customImportName, setCustomImportName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [typeInfo, setTypeInfo] = useState<TypeInfo[]>([]);
  const [showMappingInterface, setShowMappingInterface] = useState(false);
  const [csvText, setCsvText] = useState<string>('');
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

  const clearFile = () => {
    setFile(null);
    setContacts([]);
    setError(null);
    setCustomImportName('');
    setHeaders([]);
    setValidationResults([]);
    setShowMappingInterface(false);
    setCsvText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        setCsvText(content); // Store CSV text for later processing
        
        // Parse headers only at this stage
        const lines = content.split(/\r?\n/);
        const headers = lines[0].split(',').map(header => header.trim());
        setHeaders(headers);
        
        // Get automatic field mappings
        const suggestedMappings = guessFieldMappings(headers);
        
        // Prepare sample data for type detection
        const sampleRows = lines.slice(1, Math.min(6, lines.length))
          .map(line => line.split(',').map(value => value.trim()))
          .filter(row => row.length === headers.length);
        
        // Set form values with suggested mappings
        const initialMappings: FieldMappingItem[] = suggestedMappings.map(mapping => ({
          csvHeader: mapping.csvHeader,
          mappedTo: mapping.mappedTo || "ignore-column" // Use non-empty string for empty mappings
        }));
        
        // Show mapping interface
        setShowMappingInterface(true);
        
        // Process with initial mappings to get typeInfo
        const { typeInfo } = parseCSV(content, initialMappings);
        setTypeInfo(typeInfo);
        
      } catch (err) {
        console.error("CSV Processing Error:", err);
        setError('An error occurred while parsing the CSV file. Please check the file format.');
        setContacts([]);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
    };
    
    reader.readAsText(file);
  };

  const handleSubmitMapping = (mappings: FieldMappingItem[]) => {
    try {
      // Process mappings before parsing CSV
      const processedMappings = mappings.map(mapping => ({
        csvHeader: mapping.csvHeader,
        // Convert "ignore-column" to empty string or custom values to actual field names
        mappedTo: mapping.mappedTo === "ignore-column" ? "" : 
                 mapping.mappedTo.startsWith("custom-") ? mapping.mappedTo.replace("custom-", "") : 
                 mapping.mappedTo
      }));
      
      // Now parse the full CSV with mappings
      const { contacts: parsedContacts, validationResults, typeInfo } = parseCSV(csvText, processedMappings);
      
      setValidationResults(validationResults);
      setTypeInfo(typeInfo);
      
      if (parsedContacts.length === 0) {
        setError('No valid contacts found in the CSV. Make sure it has name and phone columns.');
        setContacts([]);
      } else {
        setContacts(parsedContacts);
        setShowMappingInterface(false);
      }
      
      // Show detailed results in toast
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
      console.error("Mapping Error:", err);
      setError('An error occurred while processing the CSV file. Please try again.');
      setContacts([]);
    }
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
      customName: customImportName
    });
    
    setIsUploading(false);
    clearFile();
  };

  const validRows = validationResults.filter(r => r.valid).length;
  const invalidRows = validationResults.filter(r => !r.valid).length;
  
  // Get suggested mappings from header names with properly typed result
  const suggestedMappings: FieldMappingItem[] = headers.length > 0 
    ? guessFieldMappings(headers).map(m => ({ 
        csvHeader: m.csvHeader,
        mappedTo: m.mappedTo || "ignore-column" // Use non-empty string for empty mappings
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      
      {/* Upload Zone - visible only when not in mapping mode */}
      {!showMappingInterface && (
        <FileUploadZone 
          file={file}
          error={error}
          isDragging={isDragging}
          validCount={contacts.length}
          invalidCount={invalidRows}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onBrowseClick={() => fileInputRef.current?.click()}
          onClearFile={clearFile}
        />
      )}

      {/* Error Messages */}
      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Field Mapping Interface */}
      {showMappingInterface && (
        <FieldMappingForm 
          mappings={suggestedMappings}
          typeInfo={typeInfo}
          onSubmit={handleSubmitMapping}
          onCancel={() => {
            setShowMappingInterface(false);
            clearFile();
          }}
        />
      )}
      
      {/* Validation Results */}
      {file && validationResults.length > 0 && !showMappingInterface && (
        <ValidationSummary 
          validationResults={validationResults}
          contacts={contacts}
          headers={headers}
        />
      )}

      {/* Import Form */}
      {file && contacts.length > 0 && !showMappingInterface && (
        <ImportForm 
          customImportName={customImportName}
          isUploading={isUploading}
          contactCount={contacts.length}
          onNameChange={setCustomImportName}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default CSVUploader;
