
import { Template } from '../types';
import { addDays } from 'date-fns';

// Mock templates
export const templates: Template[] = [
  {
    id: '1',
    name: 'Initial Outreach',
    body: 'Hi {name}, I\'m Alex from Taikis. Do you have 5 minutes to discuss our Mediterranean franchise opportunity?',
    createdAt: new Date('2023-09-15'),
    updatedAt: new Date('2023-09-15'),
    variables: ['name']
  },
  {
    id: '2',
    name: 'Conference Follow-up',
    body: 'Hi {name}, it was great connecting at {conference}! Would you like to schedule a follow-up to discuss how we can help your business?',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date('2023-10-05'),
    variables: ['name', 'conference']
  },
  {
    id: '3',
    name: 'No Response Follow-up',
    body: 'Hi {name}, I wanted to follow up on my previous message. Are you interested in learning more about our solutions?',
    createdAt: new Date('2023-10-10'),
    updatedAt: new Date('2023-10-10'),
    variables: ['name']
  },
  {
    id: '4',
    name: 'Product Demo Invitation',
    body: 'Hi {name}, would you be interested in a personalized demo of our {product} solution? It takes just 15 minutes and I can show you how it can help with {pain_point}.',
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-12'),
    variables: ['name', 'product', 'pain_point']
  },
  {
    id: '5',
    name: 'New Feature Announcement',
    body: 'Hi {name}, I\'m excited to share that we\'ve just launched {feature_name} which addresses {pain_point} you mentioned in our last conversation. Would you like to see how it works?',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-10'),
    variables: ['name', 'feature_name', 'pain_point']
  }
];
