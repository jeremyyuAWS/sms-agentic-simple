
import { Contact, ContactTag, ContactSegment, ContactFilter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export const createContactActions = (
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>,
  setContactTags: React.Dispatch<React.SetStateAction<ContactTag[]>>,
  setContactSegments: React.Dispatch<React.SetStateAction<ContactSegment[]>>
) => {
  const { toast } = useToast();

  const uploadContacts = (newContacts: Contact[]) => {
    // Add unique IDs if they don't exist
    const processedContacts = newContacts.map(contact => {
      if (!contact.id) {
        return { ...contact, id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` };
      }
      return contact;
    });
    
    setContacts(prev => {
      // Check for duplicates by phone number
      const existingPhoneNumbers = new Set(prev.map(c => c.phoneNumber));
      const uniqueNewContacts = processedContacts.filter(c => !existingPhoneNumbers.has(c.phoneNumber));
      
      return [...prev, ...uniqueNewContacts];
    });
    
    toast({
      title: "Contacts Uploaded",
      description: `${processedContacts.length} contacts have been added.`
    });
    
    return processedContacts;
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
    createContactTag,
    assignTagToContacts,
    removeTagFromContacts,
    createContactSegment,
    updateContactSegment,
    deleteContactSegment
  };
};
