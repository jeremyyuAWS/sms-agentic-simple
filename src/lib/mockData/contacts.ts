
import { Contact } from '../types';

// Mock contacts
export const contacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.smith@company.com',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    attendingConference: true,
    company: 'Acme Inc.',
    position: 'CTO'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phoneNumber: '+1 (555) 987-6543',
    email: 'sarah.j@tech.org',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    attendingConference: false,
    company: 'Tech Solutions',
    position: 'Marketing Director'
  },
  {
    id: '3',
    name: 'Michael Chen',
    phoneNumber: '+1 (555) 456-7890',
    email: 'michael.chen@innovate.io',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    attendingConference: true,
    company: 'Innovate IO',
    position: 'CEO'
  }
];
