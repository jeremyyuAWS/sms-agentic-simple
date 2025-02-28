import { Contact } from "@/lib/types";
import { CSVField, ValidationResult, FieldMappingItem, TypeInfo } from "./types";
import { knownFields } from "./fields-definition";

// Check if a header might be a certain field based on synonyms
export const scoreSimilarity = (header: string, field: CSVField): number => {
  const normalizedHeader = header.toLowerCase().trim();
  
  // Exact match with key
  if (normalizedHeader === field.key.toLowerCase()) return 1;
  
  // Exact match with display name
  if (normalizedHeader === field.displayName.toLowerCase()) return 0.95;
  
  // Check for exact matches in synonyms
  for (const synonym of field.synonyms) {
    if (normalizedHeader === synonym.toLowerCase()) return 0.9;
  }
  
  // Check for contains matches
  if (field.synonyms.some(syn => normalizedHeader.includes(syn.toLowerCase()))) return 0.7;
  if (normalizedHeader.includes(field.key.toLowerCase())) return 0.7;
  if (normalizedHeader.includes(field.displayName.toLowerCase())) return 0.7;
  
  // Check if the field synonyms contain the header
  if (field.synonyms.some(syn => syn.toLowerCase().includes(normalizedHeader))) return 0.5;
  
  // Check for common patterns in column names
  if (field.key === 'name' && /^(full[\s_-]?)?name$/i.test(normalizedHeader)) return 0.85;
  if (field.key === 'email' && /^e?mail$/i.test(normalizedHeader)) return 0.85;
  if (field.key === 'phoneNumber' && /^(mobile|cell|phone|tel)$/i.test(normalizedHeader)) return 0.85;
  
  return 0;
};

// Function to automatically guess field mappings
export const guessFieldMappings = (headers: string[]): { csvHeader: string; mappedTo: string; confidence: number }[] => {
  return headers.map(header => {
    let bestMatch = { field: '' as string, score: 0 };
    
    // Check against all known fields
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

// Function to detect data types from sample data
export const detectDataTypes = (headers: string[], sampleData: string[][]): TypeInfo[] => {
  return headers.map((header, index) => {
    // Get all non-empty values for this column
    const values = sampleData.map(row => row[index]).filter(val => val);
    
    if (values.length === 0) return { csvHeader: header, detectedType: 'unknown', sampleValue: '' };
    
    const sampleValue = values[0];
    
    // Email detection
    if (values.some(val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val))) {
      return { csvHeader: header, detectedType: 'email', sampleValue };
    }
    
    // Phone detection - improved to catch more formats
    if (values.some(val => {
      const cleaned = val.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?[0-9]{7,15}$/.test(cleaned);
    })) {
      return { csvHeader: header, detectedType: 'phone', sampleValue };
    }
    
    // LinkedIn URL detection - improved to catch more formats
    if (values.some(val => /linkedin\.com\/(in|profile)\/[\w\-\_]+/i.test(val))) {
      return { csvHeader: header, detectedType: 'url', sampleValue };
    }
    
    // Boolean detection
    if (values.every(val => /(yes|no|true|false|y|n|1|0)/i.test(val))) {
      return { csvHeader: header, detectedType: 'boolean', sampleValue };
    }
    
    // Name detection
    if (header.toLowerCase().includes('name') || 
        values.some(val => /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(val))) {
      return { csvHeader: header, detectedType: 'name', sampleValue };
    }
    
    // Location detection
    if (header.toLowerCase().includes('city') || 
        header.toLowerCase().includes('state') || 
        header.toLowerCase().includes('country') ||
        values.some(val => /^[A-Z][a-z]+, [A-Z]{2}$/.test(val))) {
      return { csvHeader: header, detectedType: 'location', sampleValue };
    }
    
    // Job title detection
    if (header.toLowerCase().includes('job') || 
        header.toLowerCase().includes('title') || 
        header.toLowerCase().includes('position') ||
        header.toLowerCase().includes('occupation')) {
      return { csvHeader: header, detectedType: 'job', sampleValue };
    }
    
    // Default to text
    return { csvHeader: header, detectedType: 'text', sampleValue };
  });
};

// Format phone numbers consistently with enhanced recognition
export const formatPhoneNumber = (phone: string): string => {
  // Clean the phone number
  const digits = phone.replace(/\D/g, '');
  
  // Format based on length
  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
  } else if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7)}`;
  } else if (digits.length > 10) {
    // Try to format international numbers
    // If starts with country code, format accordingly
    if (digits.startsWith('1')) {
      const countryCode = digits.substring(0, 1);
      const areaCode = digits.substring(1, 4);
      const firstPart = digits.substring(4, 7);
      const lastPart = digits.substring(7);
      return `+${countryCode} (${areaCode}) ${firstPart}-${lastPart}`;
    } else if (digits.length >= 11 && digits.length <= 15) {
      // Generic international format for other country codes
      const countryCode = digits.substring(0, 2);
      const rest = digits.substring(2);
      return `+${countryCode} ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
    }
    
    // For other international or non-standard formats, add + if missing
    return digits.length > 10 && !phone.includes('+') ? `+${digits}` : phone;
  } else {
    // For shorter numbers or unusual formats, keep as is
    return phone;
  }
};

// Function to standardize boolean values
export const standardizeBoolean = (value: string): boolean => {
  const normalizedValue = value.toLowerCase().trim();
  return ['yes', 'true', 'y', '1', 'on', 'checked'].includes(normalizedValue);
};

// Enhanced CSV parsing with improved pattern recognition
export const parseCSV = (
  csvText: string, 
  fieldMappings: FieldMappingItem[]
): { 
  headers: string[]; 
  contacts: Contact[];
  validationResults: ValidationResult[];
  typeInfo: TypeInfo[];
} => {
  const lines = csvText.trim().split(/\r?\n/); // Handle different line endings
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Get sample data for type detection (up to 5 rows)
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
    
    // Apply field mappings
    fieldMappings.forEach(mapping => {
      if (!mapping.mappedTo) return; // Skip unmapped fields
      
      const headerIndex = headers.findIndex(h => h === mapping.csvHeader);
      if (headerIndex === -1) return;
      
      const value = values[headerIndex];
      const fieldDef = knownFields.find(f => f.key === mapping.mappedTo);
      
      // Apply field-specific validation and formatting
      if (fieldDef) {
        if (fieldDef.required && !value) {
          rowErrors.push(`Required field ${fieldDef.displayName} is empty`);
        } else if (value && fieldDef.validator && !fieldDef.validator(value)) {
          rowErrors.push(fieldDef.errorMessage || `Invalid ${fieldDef.displayName} format`);
        } else if (value) {
          // Apply type-specific formatting
          if (mapping.mappedTo === 'phoneNumber') {
            contact[mapping.mappedTo] = formatPhoneNumber(value);
          } else if (mapping.mappedTo === 'attendingConference') {
            contact[mapping.mappedTo] = standardizeBoolean(value);
          } else {
            contact[mapping.mappedTo] = value;
          }
        }
      } else {
        // For custom fields, just assign the value
        contact[mapping.mappedTo] = value;
      }
    });
    
    // Check for required fields
    const hasName = !!contact.name;
    const hasPhone = !!contact.phoneNumber;
    
    if (!hasName) rowErrors.push('Missing name field');
    if (!hasPhone) rowErrors.push('Missing phone field');
    
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
  
  return { headers, contacts, validationResults, typeInfo };
};
