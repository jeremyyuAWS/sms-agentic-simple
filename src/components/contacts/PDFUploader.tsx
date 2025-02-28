
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, CheckCircle2, FileText, X, Info, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { KnowledgeBase } from '@/lib/types';

interface PDFUploaderProps {
  onPDFUploaded: (pdf: KnowledgeBase) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onPDFUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      processFile(droppedFile);
    } else {
      setError('Please drop a PDF file.');
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file.",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setError(null);
    toast({
      title: "File Selected",
      description: "PDF file selected successfully. Please add a description and upload.",
    });
  };

  const handleUpload = () => {
    if (!file) {
      setError('No file to upload.');
      toast({
        title: "No File",
        description: "Please select a PDF file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create a file reader to read the PDF content
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        // Create a new knowledge base entry
        const newKnowledgeBase: KnowledgeBase = {
          id: `kb-${Date.now()}`,
          title: file.name.replace('.pdf', ''),
          description: description || file.name,
          fileType: 'pdf',
          fileName: file.name,
          fileSize: file.size,
          dateUploaded: new Date(),
          content: e.target?.result as string,
          campaigns: []
        };
        
        onPDFUploaded(newKnowledgeBase);
        
        toast({
          title: "Upload Successful",
          description: `PDF '${file.name}' has been uploaded successfully.`,
        });
        
        // Reset the form
        setFile(null);
        setDescription('');
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (err) {
        console.error(err);
        setError('An error occurred while processing the PDF file.');
        toast({
          title: "Processing Error",
          description: "An error occurred while processing the PDF file.",
          variant: "destructive"
        });
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setError('An error occurred while reading the file.');
      toast({
        title: "File Read Error",
        description: "An error occurred while reading the file.",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    
    // Read the file as a data URL
    reader.readAsDataURL(file);
  };

  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setDescription('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          Upload Knowledge Base PDF
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            className={cn(
              'border-2 border-dashed p-8 text-center transition-all relative rounded-md',
              isDragging ? 'border-primary bg-primary/5' : 'border-border',
              (error && !file) && 'border-destructive/50 bg-destructive/5'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center space-y-4">
              {file ? (
                <>
                  <div className="flex items-center justify-between w-full max-w-md">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleClearFile} 
                      className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="w-full max-w-md mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      className="w-full p-2 border border-input rounded-md"
                      rows={3}
                      placeholder="Enter a description of this PDF (e.g., 'Product FAQ' or 'Summer Promotion Details')"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Drop your PDF file here</h3>
                    <p className="text-sm text-muted-foreground">
                      or <button className="text-primary hover:underline" onClick={handleOpenFileDialog}>select a file</button> from your computer
                    </p>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground text-left w-full max-w-xs mx-auto">
                    <p className="text-left">Upload a PDF that contains your campaign knowledge base:</p>
                    <ul className="list-disc pl-5 mt-1 text-left">
                      <li>Product FAQs</li>
                      <li>Promotion details</li>
                      <li>Sales scripts</li>
                      <li>Objection handling guides</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-destructive p-3 bg-destructive/10 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </CardContent>
      {file && (
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Upload PDF</span>
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PDFUploader;
