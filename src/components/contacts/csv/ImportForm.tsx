
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useApp } from '@/contexts/app/AppContext';

interface ImportFormProps {
  customImportName: string;
  isUploading: boolean;
  contactCount: number;
  validContactIds?: string[];
  onNameChange: (value: string) => void;
  onUpload: () => void;
}

const ImportForm: React.FC<ImportFormProps> = ({
  customImportName,
  isUploading,
  contactCount,
  validContactIds,
  onNameChange,
  onUpload
}) => {
  const { startWorkflow, updateWorkflowData } = useApp();
  
  const handleContinueToCampaign = () => {
    // Start the workflow
    startWorkflow();
    
    // Update the workflow with the contact data
    updateWorkflowData({
      contactsData: {
        contactIds: validContactIds,
        importId: `import-${Date.now()}`
      }
    });
  };
  
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
      
      <div className="flex justify-between gap-3">
        <Button onClick={onUpload} disabled={isUploading || !customImportName.trim()}>
          {isUploading ? 'Uploading...' : `Upload ${contactCount} contacts`}
        </Button>
        
        {/* Only show this button after upload is complete */}
        {validContactIds && validContactIds.length > 0 && (
          <Button variant="outline" onClick={handleContinueToCampaign}>
            Continue to Campaign Creation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportForm;
