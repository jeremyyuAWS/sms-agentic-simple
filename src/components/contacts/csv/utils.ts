import { Contact } from "@/lib/types";
import { CSVField, ValidationResult, FieldMappingItem, TypeInfo } from "./types";
import { knownFields } from "./fields-definition";

// Check if a header might be a certain field based on synonyms with improved matching
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
  
  // Check for contains matches (both ways)
  if (field.synonyms.some(syn => normalizedHeader.includes(syn.toLowerCase()))) return 0.7;
  if (field.synonyms.some(syn => syn.toLowerCase().includes(normalizedHeader))) return 0.6;
  
  if (normalizedHeader.includes(field.key.toLowerCase())) return 0.7;
  if (normalizedHeader.includes(field.displayName.toLowerCase())) return 0.7;
  
  // Enhanced pattern matching for common fields
  if (field.key === 'name') {
    if (/^(full[\s_-]?)?name$/i.test(normalizedHeader)) return 0.85;
    if (/^(first|last|contact|customer|client|person)[\s_-]?name$/i.test(normalizedHeader)) return 0.8;
    if (/name|contact|person|client/i.test(normalizedHeader)) return 0.5;
  }
  
  if (field.key === 'email') {
    if (/^e?mail$/i.test(normalizedHeader)) return 0.85;
    if (/^(email|e-mail)[\s_-]?(address)?$/i.test(normalizedHeader)) return 0.85;
  }
  
  if (field.key === 'phoneNumber') {
    if (/^(cell|mobile|phone|tel|telephone|contact)[\s_-]?(number|no|#)?$/i.test(normalizedHeader)) return 0.85;
    if (/phone|mobile|cell|contact|telephone/i.test(normalizedHeader)) return 0.5;
  }
  
  return 0;
};

// Function to automatically guess field mappings with improved accuracy
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
    
    // Lower the threshold to catch more potential matches
    return {
      csvHeader: header,
      mappedTo: bestMatch.score >= 0.4 ? bestMatch.field : '',
      confidence: bestMatch.score
    };
  });
};

// Function to detect data types from sample data with enhanced pattern matching
export const detectDataTypes = (headers: string[], sampleData: string[][]): TypeInfo[] => {
  return headers.map((header, index) => {
    // Get all non-empty values for this column
    const values = sampleData.map(row => row[index]).filter(val => val);
    
    if (values.length === 0) return { csvHeader: header, detectedType: 'unknown', sampleValue: '' };
    
    const sampleValue = values[0];
    
    // Email detection - enhanced regex
    if (values.some(val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val.trim()))) {
      return { csvHeader: header, detectedType: 'email', sampleValue };
    }
    
    // Phone detection - much more tolerant of formats
    if (values.some(val => {
      // Remove all non-numeric characters except + for country code
      const cleaned = val.replace(/[^0-9+]/g, '');
      // Check for reasonable phone number length
      return (cleaned.length >= 7 && cleaned.length <= 15) || 
             // Also check for various common phone formats
             /^\+?[0-9]{1,4}[ -.]?(\([0-9]{1,4}\)[ -.]?)?[0-9]{3,10}[ -.]?[0-9]{3,10}$/.test(val);
    })) {
      return { csvHeader: header, detectedType: 'phone', sampleValue };
    }
    
    // LinkedIn URL detection - enhanced to catch more formats
    if (values.some(val => 
      /linkedin\.com/i.test(val) || 
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/|profile\/|pub\/|company\/)/i.test(val)
    )) {
      return { csvHeader: header, detectedType: 'url', sampleValue };
    }
    
    // Boolean detection
    if (values.every(val => /(yes|no|true|false|y|n|1|0|on|off)/i.test(val.trim()))) {
      return { csvHeader: header, detectedType: 'boolean', sampleValue };
    }
    
    // Name detection - enhanced to detect more name patterns
    if (
      header.toLowerCase().includes('name') || 
      values.some(val => /^[A-Z][a-z]+( [A-Z][a-z]+)+$/.test(val.trim())) ||
      header.toLowerCase().match(/(contact|person|customer|client)/i)
    ) {
      return { csvHeader: header, detectedType: 'name', sampleValue };
    }
    
    // Location detection
    if (
      header.toLowerCase().match(/(city|state|province|country|location|address)/i) || 
      values.some(val => /^[A-Z][a-z]+,?\s+([A-Z]{2}|[A-Z][a-z]+)$/.test(val.trim()))
    ) {
      return { csvHeader: header, detectedType: 'location', sampleValue };
    }
    
    // Job title detection
    if (
      header.toLowerCase().match(/(job|title|position|occupation|role|designation)/i) ||
      values.some(val => 
        /(manager|director|executive|specialist|consultant|analyst|coordinator|assistant|officer|lead|head)/i.test(val.trim())
      )
    ) {
      return { csvHeader: header, detectedType: 'job', sampleValue };
    }
    
    // Default to text
    return { csvHeader: header, detectedType: 'text', sampleValue };
  });
};

// Format phone numbers consistently with enhanced recognition
export const formatPhoneNumber = (phone: string): string => {
  // Clean the phone number - keep only digits and +
  const cleaned = phone.replace(/[^0-9+]/g, '');
  
  // If empty, return as is
  if (!cleaned) return phone;
  
  // Format based on length
  if (cleaned.length === 10) {
    // Standard US number: 1234567890 -> (123) 456-7890
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    // US number with country code: 11234567890 -> +1 (123) 456-7890
    return `+1 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7)}`;
  } else if (cleaned.startsWith('+1') && cleaned.length === 12) {
    // US number with + country code: +11234567890 -> +1 (123) 456-7890
    return `+1 (${cleaned.substring(2, 5)}) ${cleaned.substring(5, 8)}-${cleaned.substring(8)}`;
  } else if (cleaned.length > 10) {
    // Try to format international numbers
    if (cleaned.startsWith('+')) {
      // Already has country code with +
      const countryCodeEnd = Math.min(4, cleaned.length - 7); // Allow country codes up to 3 digits
      const countryCode = cleaned.substring(0, countryCodeEnd + 1); // Include the +
      const rest = cleaned.substring(countryCodeEnd + 1);
      
      // Format the rest nicely
      if (rest.length > 6) {
        return `${countryCode} ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
      } else {
        return `${countryCode} ${rest}`;
      }
    } else if (cleaned.length >= 11 && cleaned.length <= 15) {
      // Assume first 1-3 digits are country code
      const countryCodeEnd = Math.min(3, cleaned.length - 7);
      const countryCode = cleaned.substring(0, countryCodeEnd);
      const rest = cleaned.substring(countryCodeEnd);
      
      // Format with + and spaces
      if (rest.length > 6) {
        return `+${countryCode} ${rest.substring(0, 3)} ${rest.substring(3, 6)} ${rest.substring(6)}`;
      } else {
        return `+${countryCode} ${rest}`;
      }
    }
    
    // For other unusual formats, just add + if missing
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  } else {
    // For shorter numbers or unusual formats, keep as is but clean
    return cleaned;
  }
};

// Function to standardize boolean values with enhanced recognition
export const standardizeBoolean = (value: string): boolean => {
  const normalizedValue = value.toLowerCase().trim();
  return ['yes', 'true', 'y', '1', 'on', 'checked', 'enabled', 'active'].includes(normalizedValue);
};

// Enhanced CSV parsing with improved pattern recognition and error tolerance
export const parseCSV = (csvText: string): { 
  headers: string[]; 
  contacts: any[];
} => {
  try {
    // Handle different line endings and potential BOM characters
    const cleanedText = csvText.replace(/^\ufeff/, '').trim();
    const lines = cleanedText.split(/\r?\n/);
    
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }
    
    // Parse headers, trimming whitespace
    const headers = lines[0].split(',').map(header => header.trim());
    
    // Parse the data rows
    const contacts = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      // Split by comma (simple implementation)
      let values = line.split(',').map(val => val.trim());
      
      // Ensure the row has the right number of columns
      while (values.length < headers.length) {
        values.push('');
      }
      
      // Truncate if it has more columns than headers
      values = values.slice(0, headers.length);
      
      // Create an object with the headers as keys
      const contact: {[key: string]: string} = {};
      headers.forEach((header, j) => {
        contact[header] = values[j];
      });
      
      contacts.push(contact);
    }
    
    return { headers, contacts };
  } catch (error) {
    console.error("Error parsing CSV:", error);
    throw new Error(`Failed to parse CSV: ${error instanceof Error ? error.message : String(error)}`);
  }
};
