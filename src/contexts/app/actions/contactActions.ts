
import { Contact } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createContactActions = (
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>
) => {
  const { toast } = useToast();

  const uploadContacts = (newContacts: Contact[]) => {
    // Generate IDs for the new contacts
    const contactsWithIds = newContacts.map(contact => ({
      ...contact,
      id: `contact-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    }));
    
    // Add the new contacts
    setContacts(prev => [...prev, ...contactsWithIds]);
    
    toast({
      title: "Contacts Uploaded",
      description: `${contactsWithIds.length} contacts have been uploaded successfully.`
    });
  };

  return {
    uploadContacts
  };
};
