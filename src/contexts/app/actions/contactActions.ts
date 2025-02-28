
import { Contact, ContactTag, ContactSegment, ContactFilter, ContactImport, FieldMapping } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createContactActions = (
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>,
  setContactTags: React.Dispatch<React.SetStateAction<ContactTag[]>>,
  setContactSegments: React.Dispatch<React.SetStateAction<ContactSegment[]>>
) => {
  const { toast } = useToast();
  
  // Track import history in-memory (in a real app, this would be persisted)
  // This could be moved to state in the AppProvider if needed across components
  let contactImports: ContactImport[] = [];

  /**
   * Upload contacts with source tracking
   */
  const uploadContacts = (
    newContacts: Contact[], 
    source: {
      type: 'csv' | 'manual' | 'import' | 'api';
      name: string;
      filename?: string;
      customName?: string; // Parameter for custom import name
    } = { type: 'manual', name: 'Manual Entry' }
  ) => {
    const batchId = `import-${Date.now()}`;
    const importTime = new Date();
    
    // Use custom name if provided, otherwise use the default name
    const importName = source.customName || source.name;
    
    // Add source information and unique IDs if they don't exist
    const processedContacts = newContacts.map(contact => {
      const contactId = contact.id || `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      return { 
        ...contact, 
        id: contactId,
        source: {
          type: source.type,
          name: importName, // Use the determined name
          importedAt: importTime,
          batchId
        }
      };
    });
    
    // Create import record
    const importRecord: ContactImport = {
      id: batchId,
      name: importName, // Use the determined name
      filename: source.filename || `Import ${new Date().toLocaleString()}`,
      importedAt: importTime,
      contactCount: processedContacts.length,
      status: 'completed',
      source: source.type
    };
    
    contactImports.push(importRecord);
    
    // Merge with existing contacts, avoiding duplicates by phone number
    setContacts(prev => {
      // Create a Map of existing contacts by phone number for quick lookup
      const existingContactsByPhone = new Map<string, Contact>();
      prev.forEach(contact => {
        existingContactsByPhone.set(contact.phoneNumber, contact);
      });
      
      // Process each new contact
      const updatedContacts = [...prev];
      const addedContacts: Contact[] = [];
      
      processedContacts.forEach(newContact => {
        const existingContact = existingContactsByPhone.get(newContact.phoneNumber);
        
        if (existingContact) {
          // Update existing contact fields, but keep the original ID
          const mergedContact = {
            ...existingContact,
            ...newContact,
            id: existingContact.id,
            // If the existing contact has tags, merge them with new ones
            tags: [...new Set([...(existingContact.tags || []), ...(newContact.tags || [])])]
          };
          
          // Find and replace the existing contact
          const index = updatedContacts.findIndex(c => c.id === existingContact.id);
          if (index !== -1) {
            updatedContacts[index] = mergedContact;
          }
          
          // Update the map with the merged contact
          existingContactsByPhone.set(newContact.phoneNumber, mergedContact);
        } else {
          // Add as a new contact
          updatedContacts.push(newContact);
          addedContacts.push(newContact);
          existingContactsByPhone.set(newContact.phoneNumber, newContact);
        }
      });
      
      toast({
        title: "Contacts Processed",
        description: addedContacts.length === processedContacts.length
          ? `Added ${addedContacts.length} new contacts.`
          : `Added ${addedContacts.length} new contacts and updated ${processedContacts.length - addedContacts.length} existing contacts.`
      });
      
      return updatedContacts;
    });
    
    return {
      importId: batchId,
      contacts: processedContacts,
      addedCount: processedContacts.length
    };
  };

  /**
   * Get contacts by import batch
   */
  const getContactsByImport = (batchId: string): Contact[] => {
    return []; // This would need to be implemented in a component with access to contacts state
  };

  /**
   * Get all import history records
   */
  const getContactImports = (): ContactImport[] => {
    return contactImports;
  };

  const createContactTag = (tagData: Omit<ContactTag, 'id' | 'count'>) => {
    const newTag: ContactTag = {
      ...tagData,
      id: `tag-${Date.now()}`,
      count: 0
    };
    
    setContactTags(prev => [...prev, newTag]);
    
    toast({
      title: "Tag Created",
      description: `Tag "${newTag.name}" has been created.`
    });
    
    return newTag;
  };

  const assignTagToContacts = (tagId: string, contactIds: string[]) => {
    if (contactIds.length === 0) return;
    
    setContacts(prev => prev.map(contact => {
      if (contactIds.includes(contact.id)) {
        const tags = [...(contact.tags || [])];
        if (!tags.includes(tagId)) {
          tags.push(tagId);
        }
        return { ...contact, tags };
      }
      return contact;
    }));
    
    setContactTags(prev => prev.map(tag => {
      if (tag.id === tagId) {
        return { 
          ...tag, 
          count: tag.count + contactIds.length 
        };
      }
      return tag;
    }));
    
    toast({
      title: "Tags Assigned",
      description: `Tag added to ${contactIds.length} contacts.`
    });
  };

  const removeTagFromContacts = (tagId: string, contactIds: string[]) => {
    if (contactIds.length === 0) return;
    
    setContacts(prev => prev.map(contact => {
      if (contactIds.includes(contact.id) && contact.tags) {
        return { 
          ...contact, 
          tags: contact.tags.filter(id => id !== tagId) 
        };
      }
      return contact;
    }));
    
    setContactTags(prev => prev.map(tag => {
      if (tag.id === tagId) {
        return { 
          ...tag, 
          count: Math.max(0, tag.count - contactIds.length) 
        };
      }
      return tag;
    }));
    
    toast({
      title: "Tags Removed",
      description: `Tag removed from ${contactIds.length} contacts.`
    });
  };

  const createContactSegment = (segmentData: Omit<ContactSegment, 'id' | 'count' | 'createdAt'>) => {
    const newSegment: ContactSegment = {
      ...segmentData,
      id: `segment-${Date.now()}`,
      count: 0,
      createdAt: new Date()
    };
    
    setContactSegments(prev => [...prev, newSegment]);
    
    toast({
      title: "Segment Created",
      description: `Segment "${newSegment.name}" has been created.`
    });
    
    return newSegment;
  };

  const updateContactSegment = (id: string, updates: Partial<Omit<ContactSegment, 'id' | 'count' | 'createdAt'>>) => {
    setContactSegments(prev => prev.map(segment => {
      if (segment.id === id) {
        return { ...segment, ...updates };
      }
      return segment;
    }));
    
    toast({
      title: "Segment Updated",
      description: "Segment has been updated successfully."
    });
  };

  const deleteContactSegment = (id: string) => {
    setContactSegments(prev => prev.filter(segment => segment.id !== id));
    
    toast({
      title: "Segment Deleted",
      description: "Segment has been deleted successfully."
    });
  };

  // Update contact count for segments
  const updateSegmentCounts = () => {
    setContactSegments(segments => {
      return segments.map(segment => {
        // This would need to be implemented with the actual filtering logic
        // that matches the one in the UI components
        return segment;
      });
    });
  };

  return {
    uploadContacts,
    getContactsByImport,
    getContactImports,
    createContactTag,
    assignTagToContacts,
    removeTagFromContacts,
    createContactSegment,
    updateContactSegment,
    deleteContactSegment
  };
};
