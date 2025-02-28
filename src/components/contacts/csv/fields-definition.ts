
import { CSVField } from "./types";

// Define known field definitions for CSV mapping
export const knownFields: CSVField[] = [
  {
    key: 'name',
    displayName: 'Name',
    synonyms: ['full name', 'contact name', 'person', 'customer', 'client', 'first name', 'firstname', 'first', 'last name', 'lastname', 'last', 'contact', 'lead'],
    required: true,
    validator: (value) => !!value.trim(),
    errorMessage: 'Name is required',
    formatExample: 'John Smith'
  },
  {
    key: 'phoneNumber',
    displayName: 'Phone Number',
    synonyms: ['phone', 'telephone', 'cell', 'mobile', 'contact number', 'tel', 'cell phone', 'work phone', 'phone number', 'mobile number', 'cell number', 'contact phone', 'primary phone', 'secondary phone', 'home phone'],
    required: true,
    validator: (value) => {
      const cleanedNumber = value.replace(/[\s\(\)\-\.]/g, '');
      return /^\+?[0-9]{7,15}$/.test(cleanedNumber);
    },
    errorMessage: 'Invalid phone number format',
    formatExample: '(123) 456-7890'
  },
  {
    key: 'email',
    displayName: 'Email',
    synonyms: ['e-mail', 'mail', 'email address', 'e-mail address', 'electronic mail', 'contact email', 'primary email', 'work email', 'personal email'],
    required: false,
    validator: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    errorMessage: 'Invalid email format',
    formatExample: 'example@email.com'
  },
  {
    key: 'company',
    displayName: 'Company',
    synonyms: ['organization', 'org', 'business', 'employer', 'firm', 'workplace', 'company name', 'corp', 'corporation', 'enterprise', 'business name', 'employer name', 'workplace name'],
    required: false,
    formatExample: 'Acme Corp'
  },
  {
    key: 'position',
    displayName: 'Position',
    synonyms: ['job title', 'title', 'role', 'job role', 'occupation', 'job', 'designation', 'profession', 'work title', 'employment', 'function', 'job position'],
    required: false,
    formatExample: 'Marketing Manager'
  },
  {
    key: 'linkedinUrl',
    displayName: 'LinkedIn URL',
    synonyms: ['linkedin', 'linkedin profile', 'linkedin link', 'social profile', 'linkedin url', 'li profile', 'social link', 'linkedin address'],
    required: false,
    validator: (value) => !value || /linkedin\.com\/(in|profile)\/[\w\-\_]+/i.test(value),
    errorMessage: 'Invalid LinkedIn URL',
    formatExample: 'https://linkedin.com/in/username'
  },
  {
    key: 'attendingConference',
    displayName: 'Attending Conference',
    synonyms: ['conference', 'attending', 'event attendance', 'will attend', 'conference attendance', 'rsvp', 'attending event', 'event participation', 'conference registration', 'registered for event', 'confirmed attendance'],
    required: false,
    validator: (value) => !value || /(yes|no|true|false|y|n|1|0|on|off|checked)/i.test(value),
    formatExample: 'Yes/No/True/False'
  },
  {
    key: 'city',
    displayName: 'City',
    synonyms: ['town', 'municipality', 'location', 'city name', 'place', 'urban area'],
    required: false,
    formatExample: 'San Francisco'
  },
  {
    key: 'state',
    displayName: 'State/Province',
    synonyms: ['province', 'region', 'territory', 'department', 'county', 'district'],
    required: false,
    formatExample: 'California'
  },
  {
    key: 'country',
    displayName: 'Country',
    synonyms: ['nation', 'land', 'state', 'homeland', 'republic'],
    required: false,
    formatExample: 'United States'
  },
  {
    key: 'zipCode',
    displayName: 'Zip/Postal Code',
    synonyms: ['postal code', 'zip', 'postcode', 'post code', 'postal', 'area code'],
    required: false,
    validator: (value) => !value || /^[0-9A-Z]{3,10}(-[0-9A-Z]{3,10})?$/i.test(value.trim()),
    errorMessage: 'Invalid postal code format',
    formatExample: '12345 or 12345-6789'
  }
];
