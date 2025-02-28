
import { CSVField } from "./types";

// Define known field definitions for CSV mapping
export const knownFields: CSVField[] = [
  {
    key: 'name',
    displayName: 'Name',
    synonyms: ['full name', 'contact name', 'person', 'customer', 'client', 'first name', 'firstname', 'first', 'last name', 'lastname', 'last'],
    required: true,
    validator: (value) => !!value.trim(),
    errorMessage: 'Name is required',
    formatExample: 'John Smith'
  },
  {
    key: 'phoneNumber',
    displayName: 'Phone Number',
    synonyms: ['phone', 'telephone', 'cell', 'mobile', 'contact number', 'tel', 'cell phone', 'work phone', 'phone number', 'mobile number', 'cell number'],
    required: true,
    validator: (value) => {
      const cleanedNumber = value.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?\d{10,15}$/.test(cleanedNumber);
    },
    errorMessage: 'Invalid phone number format',
    formatExample: '(123) 456-7890'
  },
  {
    key: 'email',
    displayName: 'Email',
    synonyms: ['e-mail', 'mail', 'email address', 'e-mail address', 'electronic mail'],
    required: false,
    validator: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    errorMessage: 'Invalid email format',
    formatExample: 'example@email.com'
  },
  {
    key: 'company',
    displayName: 'Company',
    synonyms: ['organization', 'org', 'business', 'employer', 'firm', 'workplace', 'company name', 'corp', 'corporation', 'enterprise'],
    required: false,
    formatExample: 'Acme Corp'
  },
  {
    key: 'position',
    displayName: 'Position',
    synonyms: ['job title', 'title', 'role', 'job role', 'occupation', 'job', 'designation', 'profession'],
    required: false,
    formatExample: 'Marketing Manager'
  },
  {
    key: 'linkedinUrl',
    displayName: 'LinkedIn URL',
    synonyms: ['linkedin', 'linkedin profile', 'linkedin link', 'social profile', 'linkedin url'],
    required: false,
    validator: (value) => !value || /linkedin\.com\/in\/[\w\-\_]+/.test(value),
    errorMessage: 'Invalid LinkedIn URL',
    formatExample: 'https://linkedin.com/in/username'
  },
  {
    key: 'attendingConference',
    displayName: 'Attending Conference',
    synonyms: ['conference', 'attending', 'event attendance', 'will attend', 'conference attendance', 'rsvp'],
    required: false,
    validator: (value) => !value || /(yes|no|true|false|y|n|1|0)/i.test(value),
    formatExample: 'Yes/No/True/False'
  }
];
