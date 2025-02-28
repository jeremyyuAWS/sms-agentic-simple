
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileUploadZoneProps {
  file: File | null;
  error: string | null;
  isDragging: boolean;
  validCount: number;
  invalidCount: number;
  validContactIds?: string[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onBrowseClick: () => void;
  onClearFile: () => void;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  file,
  error,
  isDragging,
  validCount,
  invalidCount,
  validContactIds,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
  onClearFile
}) => {
  const totalRows = validCount + invalidCount;
  const successRate = totalRows ? Math.round((validCount / totalRows) * 100) : 0;
  
  return (
    <Card 
      className={`
        p-6 
        border-2 
        border-dashed 
        flex 
        flex-col 
        items-center 
        justify-center 
        cursor-pointer 
        transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        ${error ? 'border-red-300 bg-red-50' : ''}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={file ? undefined : onBrowseClick}
    >
      {error ? (
        <div className="text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h3 className="font-medium text-lg">Error</h3>
          <p className="text-sm text-red-600">{error}</p>
          <Button variant="outline" size="sm" onClick={onClearFile}>
            Try Again
          </Button>
        </div>
      ) : file ? (
        <div className="w-full space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB • CSV
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFile}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {totalRows > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  <CheckCircle className="h-4 w-4 text-green-500 inline mr-1" />
                  {validCount} valid rows
                </span>
                <span className="text-muted-foreground">{successRate}% success</span>
              </div>
              <Progress value={successRate} className="h-2" />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-medium text-lg">Drag & Drop CSV File</h3>
            <p className="text-sm text-muted-foreground my-2">
              or
            </p>
            <Button variant="secondary" size="sm" onClick={onBrowseClick}>
              Browse Files
            </Button>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Upload a CSV file containing your contacts. We support common CSV formats exported from Google Contacts, Outlook, LinkedIn, etc.
          </p>
        </div>
      )}
    </Card>
  );
};

export default FileUploadZone;
