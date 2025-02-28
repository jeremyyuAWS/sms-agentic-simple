
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-6 text-center transition-all',
        isDragging ? 'border-primary bg-primary/5' : 'border-border',
        error && 'border-destructive/50 bg-destructive/5'
      )}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {file ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-medium">{file.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearFile}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {validCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">{validCount} valid contacts detected</span>
            </div>
          )}
          
          {invalidCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{invalidCount} invalid rows found</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="font-medium">Drag and drop your CSV file here</h3>
          <p className="text-sm text-muted-foreground">
            or <button type="button" className="text-primary hover:underline" onClick={onBrowseClick}>browse</button> to upload
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
