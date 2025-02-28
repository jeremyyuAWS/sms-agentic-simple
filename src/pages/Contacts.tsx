
import React from 'react';
import CSVUploader from '@/components/contacts/CSVUploader';
import { useApp } from '@/contexts/app/AppContext';
import { WorkflowProgress } from '@/components/workflow/WorkflowProgress';
import { WorkflowGuidance } from '@/components/workflow/WorkflowGuidance';

const Contacts: React.FC = () => {
  const { workflow } = useApp();
  
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Show workflow progress if active */}
      {workflow.active && <WorkflowProgress />}
      
      {/* Show guidance if workflow is active */}
      {workflow.active && <WorkflowGuidance />}
      
      <div className="grid grid-cols-1 gap-6">
        <CSVUploader />
      </div>
    </div>
  );
};

export default Contacts;
