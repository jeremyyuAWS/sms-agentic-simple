
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ImportFormProps {
  customImportName: string;
  isUploading: boolean;
  contactCount: number;
  onNameChange: (value: string) => void;
  onUpload: () => void;
}

const ImportForm: React.FC<ImportFormProps> = ({
  customImportName,
  isUploading,
  contactCount,
  onNameChange,
  onUpload
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="importName">Import Name (required)</Label>
        <Input
          id="importName"
          placeholder="Give this import a meaningful name (e.g., Conference Leads 2023)"
          value={customImportName}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          This name will help you identify these contacts when creating campaigns and contact lists
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onUpload} disabled={isUploading || !customImportName.trim()}>
          {isUploading ? 'Uploading...' : `Upload ${contactCount} contacts`}
        </Button>
      </div>
    </div>
  );
};

export default ImportForm;
