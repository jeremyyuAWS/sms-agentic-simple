
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertCircle, Info } from 'lucide-react';

interface DeleteImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  deletingImportName: string;
  onConfirmDelete: (deleteWithContacts: boolean) => void;
}

const DeleteImportDialog: React.FC<DeleteImportDialogProps> = ({
  isOpen,
  onOpenChange,
  deletingImportName,
  onConfirmDelete
}) => {
  const [deleteImportWithContacts, setDeleteImportWithContacts] = useState(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Delete Import History
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the import "{deletingImportName}"?
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-amber-800 text-sm">
                  <p className="font-medium">Note about contacts</p>
                  <p className="mt-1">
                    You can choose to keep the contacts in your database or delete them along with the import history.
                  </p>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="deleteContacts"
              checked={deleteImportWithContacts}
              onChange={(e) => setDeleteImportWithContacts(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="deleteContacts" className="text-sm font-medium text-gray-900">
              Also delete contacts from this import
            </label>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirmDelete(deleteImportWithContacts)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteImportWithContacts 
              ? "Delete Import & Contacts" 
              : "Delete Import Only"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteImportDialog;
