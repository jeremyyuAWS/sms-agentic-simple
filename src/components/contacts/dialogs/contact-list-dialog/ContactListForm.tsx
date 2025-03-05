
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ContactListFormProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const ContactListForm: React.FC<ContactListFormProps> = ({
  name,
  description,
  onNameChange,
  onDescriptionChange
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <label htmlFor="listName" className="text-sm font-medium">
          List Name*
        </label>
        <Input
          id="listName"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="E.g., Q2 Sales Prospects"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="listDescription" className="text-sm font-medium">
          Description (Optional)
        </label>
        <Textarea
          id="listDescription"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add a description to help identify this list"
          rows={3}
        />
      </div>
    </div>
  );
};

export default ContactListForm;
