
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
    if (!file) {
      setError('No file selected.');
      return;
    }
    
    // Accept more file types - some CSV files might have different MIME types
    const acceptedTypes = ['text/csv', 'application/csv', 'application/vnd.ms-excel', 'text/plain'];
    if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      setError('Please select a CSV file. The file should have a .csv extension.');
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
        if (!content || content.trim() === '') {
          throw new Error('The file appears to be empty');
        }
        
        setCsvText(content); // Store CSV text for later processing
        
        // Handle different line endings and potential BOM characters
        const cleanedContent = content.replace(/^\ufeff/, '').trim();
        const lines = cleanedContent.split(/\r?\n/);
        
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least a header row and one data row');
        }
        
        // Parse headers, trimming whitespace
        const headers = lines[0].split(',').map(header => header.trim());
        setHeaders(headers);
        
        // Check if there are multiple rows of data
        if (lines.length < 2) {
          throw new Error('CSV file must contain at least one row of data besides the header');
        }
        
        // Get automatic field mappings
        const suggestedMappings = guessFieldMappings(headers);
        
        // Prepare sample data for type detection
        const sampleRows = lines.slice(1, Math.min(6, lines.length))
          .map(line => {
            // Split by comma, handling simple cases
            const values = line.split(',').map(value => value.trim());
            
            // Ensure the row has the correct number of columns
            const paddedValues = [...values];
            while (paddedValues.length < headers.length) {
              paddedValues.push('');
            }
            
            return paddedValues.slice(0, headers.length);
          })
          .filter(row => row.some(cell => cell.trim() !== ''));  // Filter out empty rows
        
        // Set form values with suggested mappings
        const initialMappings: FieldMappingItem[] = suggestedMappings.map(mapping => ({
          csvHeader: mapping.csvHeader,
          mappedTo: mapping.mappedTo || "ignore-column" // Use non-empty string for empty mappings
        }));
        
        // Process with initial mappings to get typeInfo
        const { typeInfo } = parseCSV(content, initialMappings);
        setTypeInfo(typeInfo);
        
        // Show mapping interface
        setShowMappingInterface(true);
        
      } catch (err) {
        console.error("CSV Processing Error:", err);
        setError(`Error processing CSV file: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setContacts([]);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file. Please try again with a different file.');
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
        setError('No valid contacts found in the CSV. Please check your field mappings and ensure your data contains required fields (name and phone number).');
        setContacts([]);
        
        // Show diagnostic info in toast
        const validRows = validationResults.filter(r => r.valid).length;
        const invalidRows = validationResults.filter(r => !r.valid).length;
        
        if (invalidRows > 0) {
          const commonErrors = validationResults
            .filter(r => !r.valid)
            .flatMap(r => r.errors)
            .reduce((counts: Record<string, number>, error) => {
              counts[error] = (counts[error] || 0) + 1;
              return counts;
            }, {});
          
          const mostCommonError = Object.entries(commonErrors)
            .sort((a, b) => b[1] - a[1])[0];
          
          if (mostCommonError) {
            toast({
              title: `CSV Import Issue: ${invalidRows} invalid rows`,
              description: `Most common error: "${mostCommonError[0]}" (${mostCommonError[1]} occurrences). Check the validation details for more information.`,
              variant: "destructive",
            });
          }
        }
      } else {
        setContacts(parsedContacts);
        setShowMappingInterface(false);
        
        // Show detailed results in toast
        const invalidRows = validationResults.filter(r => !r.valid);
        if (invalidRows.length > 0) {
          toast({
            title: `${parsedContacts.length} contacts ready to import`,
            description: `${invalidRows.length} rows were skipped due to validation errors. See details below.`,
            variant: "warning",  // Now using our new warning variant
          });
        } else {
          toast({
            title: `${parsedContacts.length} valid contacts ready to import`,
            description: "All rows passed validation",
          });
        }
      }
    } catch (err) {
      console.error("Mapping Error:", err);
      setError(`Error processing CSV data: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
    
    toast({
      title: `${contacts.length} contacts imported successfully`,
      description: `Import "${customImportName}" has been completed.`,
    });
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
        accept=".csv,text/csv,application/csv,application/vnd.ms-excel,text/plain"
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
