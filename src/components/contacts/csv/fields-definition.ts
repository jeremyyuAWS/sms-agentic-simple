
import { CSVField } from "./types";

// Define known field definitions for CSV mapping with more permissive validation
export const knownFields: CSVField[] = [
  {
    key: 'name',
    displayName: 'Name',
    synonyms: ['full name', 'contact name', 'person', 'customer', 'client', 'first name', 'firstname', 'first', 'last name', 'lastname', 'last', 'contact', 'lead', 'full_name', 'contact_name', 'username'],
    required: true,
    validator: (value) => !!value.trim(),
    errorMessage: 'Name is required',
    formatExample: 'John Smith'
  },
  {
    key: 'phoneNumber',
    displayName: 'Phone Number',
    synonyms: ['phone', 'telephone', 'cell', 'mobile', 'contact number', 'tel', 'cell phone', 'work phone', 'phone number', 'mobile number', 'cell number', 'contact phone', 'primary phone', 'secondary phone', 'home phone', 'phone_number', 'mobile_phone', 'work_phone', 'cell_phone', 'contact_phone', 'telephone_number', 'phone #', 'mobile #', 'cell #'],
    required: true,
    validator: (value) => {
      // More permissive validation - just check for some digits
      const digits = value.replace(/\D/g, '');
      return digits.length >= 7;
    },
    errorMessage: 'Phone number must contain at least 7 digits',
    formatExample: '(123) 456-7890'
  },
  {
    key: 'email',
    displayName: 'Email',
    synonyms: ['e-mail', 'mail', 'email address', 'e-mail address', 'electronic mail', 'contact email', 'primary email', 'work email', 'personal email', 'email_address', 'contact_email', 'work_email', 'primary_email', 'personal_email', 'e_mail'],
    required: false,
    validator: (value) => !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim()),
    errorMessage: 'Invalid email format',
    formatExample: 'example@email.com'
  },
  {
    key: 'company',
    displayName: 'Company',
    synonyms: ['organization', 'org', 'business', 'employer', 'firm', 'workplace', 'company name', 'corp', 'corporation', 'enterprise', 'business name', 'employer name', 'workplace name', 'company_name', 'organization_name', 'business_name', 'employer_name', 'workplace_name', 'institution', 'agency'],
    required: false,
    formatExample: 'Acme Corp'
  },
  {
    key: 'position',
    displayName: 'Position',
    synonyms: ['job title', 'title', 'role', 'job role', 'occupation', 'job', 'designation', 'profession', 'work title', 'employment', 'function', 'job position', 'job_title', 'job_role', 'work_title', 'job_position', 'professional_title', 'business_title', 'job_function'],
    required: false,
    formatExample: 'Marketing Manager'
  },
  {
    key: 'linkedinUrl',
    displayName: 'LinkedIn URL',
    synonyms: ['linkedin', 'linkedin profile', 'linkedin link', 'social profile', 'linkedin url', 'li profile', 'social link', 'linkedin address', 'linked_in', 'linkedin_url', 'linkedin_profile', 'linkedin_link', 'li_profile', 'social_profile', 'social_link'],
    required: false,
    validator: (value) => !value || /linkedin\.com/i.test(value),
    errorMessage: 'Invalid LinkedIn URL',
    formatExample: 'https://linkedin.com/in/username'
  },
  {
    key: 'attendingConference',
    displayName: 'Attending Conference',
    synonyms: ['conference', 'attending', 'event attendance', 'will attend', 'conference attendance', 'rsvp', 'attending event', 'event participation', 'conference registration', 'registered for event', 'confirmed attendance', 'attending_conference', 'conference_attendance', 'event_attendance', 'will_attend', 'event_participation', 'conference_registration'],
    required: false,
    validator: (value) => !value || /(yes|no|true|false|y|n|1|0|on|off|checked|unchecked)/i.test(value.trim()),
    formatExample: 'Yes/No/True/False'
  },
  {
    key: 'city',
    displayName: 'City',
    synonyms: ['town', 'municipality', 'location', 'city name', 'place', 'urban area', 'city_name', 'town_name', 'municipality_name', 'place_name', 'urban_area', 'location_city'],
    required: false,
    formatExample: 'San Francisco'
  },
  {
    key: 'state',
    displayName: 'State/Province',
    synonyms: ['province', 'region', 'territory', 'department', 'county', 'district', 'state_province', 'province_state', 'region_name', 'territory_name', 'department_name', 'state_name', 'province_name', 'county_name', 'district_name'],
    required: false,
    formatExample: 'California'
  },
  {
    key: 'country',
    displayName: 'Country',
    synonyms: ['nation', 'land', 'state', 'homeland', 'republic', 'country_name', 'nation_name', 'state_name', 'location_country', 'native_country'],
    required: false,
    formatExample: 'United States'
  },
  {
    key: 'zipCode',
    displayName: 'Zip/Postal Code',
    synonyms: ['postal code', 'zip', 'postcode', 'post code', 'postal', 'area code', 'zip_code', 'postal_code', 'post_code', 'postcode', 'zip_postal', 'area_code'],
    required: false,
    validator: (value) => !value || /^[0-9A-Z]{3,10}(-[0-9A-Z]{3,10})?$/i.test(value.trim()),
    errorMessage: 'Invalid postal code format',
    formatExample: '12345 or 12345-6789'
  },
  {
    key: 'source',
    displayName: 'Source',
    synonyms: ['lead source', 'contact source', 'referral source', 'where from', 'how found', 'channel', 'lead_source', 'contact_source', 'referral_source', 'acquisition_source', 'marketing_source'],
    required: false,
    formatExample: 'Website, Conference, Referral'
  },
  {
    key: 'notes',
    displayName: 'Notes',
    synonyms: ['comments', 'additional info', 'remarks', 'description', 'observations', 'additional information', 'additional_information', 'additional_notes', 'contact_notes', 'client_notes', 'personal_notes', 'comment'],
    required: false,
    formatExample: 'Any additional information about the contact'
  }
];
