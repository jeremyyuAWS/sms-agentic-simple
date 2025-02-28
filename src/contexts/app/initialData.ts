
import { TemplateCategory, ContactList } from '@/lib/types';
import { contacts } from '@/lib/mockData';

export const initialTemplateCategories: TemplateCategory[] = [
  {
    id: 'category-1',
    name: 'Outreach',
    color: 'blue',
    description: 'Templates for initial outreach to new contacts'
  },
  {
    id: 'category-2',
    name: 'Follow-up',
    color: 'green',
    description: 'Templates for following up with contacts who haven\'t responded'
  },
  {
    id: 'category-3',
    name: 'Nurture',
    color: 'purple',
    description: 'Templates for nurturing relationships with engaged contacts'
  }
];

export const initialContactLists: ContactList[] = [
  {
    id: 'list-1',
    name: 'Conference Attendees',
    description: 'People who attended the 2023 Annual Tech Conference',
    contactIds: contacts.slice(0, 15).map(c => c.id),
    createdAt: new Date('2023-05-15'),
    source: 'csv'
  },
  {
    id: 'list-2',
    name: 'Newsletter Subscribers',
    description: 'Active subscribers to our monthly newsletter',
    contactIds: contacts.slice(15, 35).map(c => c.id),
    createdAt: new Date('2023-06-20'),
    source: 'import'
  },
  {
    id: 'list-3',
    name: 'Product Demo Requests',
    description: 'People who requested a product demo in the last 3 months',
    contactIds: contacts.slice(35, 50).map(c => c.id),
    createdAt: new Date('2023-08-05'),
    source: 'manual'
  }
];
