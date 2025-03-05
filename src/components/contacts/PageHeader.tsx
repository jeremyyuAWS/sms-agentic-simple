
import React from 'react';

const PageHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="space-y-1 text-left">
        <h1 className="text-3xl font-bold tracking-tight">Contacts</h1>
        <p className="text-muted-foreground">
          Manage your contacts and contact lists
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
