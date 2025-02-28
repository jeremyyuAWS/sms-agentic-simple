
import { Contact } from "@/lib/types";

export interface CSVUploaderProps {
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

export interface ValidationResult {
  rowIndex: number;
  valid: boolean;
  errors: string[];
  rawData: string[];
}

export interface CSVField {
  key: string;
  displayName: string;
  synonyms: string[];
  required: boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
  formatExample?: string;
}

export interface TypeInfo {
  csvHeader: string;
  detectedType: string;
  sampleValue: string;
}

export interface FieldMappingItem {
  csvHeader: string;
  mappedTo: string;
}

// Add specific interface for contact rows from CSV
export interface ContactCSVRow {
  [key: string]: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  notes?: string;
  linkedIn?: string;
  twitter?: string;
}
