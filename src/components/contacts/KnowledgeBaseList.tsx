
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KnowledgeBase } from '@/lib/types';
import { File, Trash2, Calendar, ArrowUpDown, Search, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  onDeleteKnowledgeBase: (id: string) => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({ 
  knowledgeBases,
  onDeleteKnowledgeBase
}) => {
  const { toast } = useToast();
  const [selectedPdf, setSelectedPdf] = React.useState<KnowledgeBase | null>(null);

  const handleDelete = (id: string) => {
    onDeleteKnowledgeBase(id);
    toast({
      title: "Knowledge Base Deleted",
      description: "The knowledge base document has been deleted successfully.",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (knowledgeBases.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <File className="h-5 w-5 text-primary" />
            Knowledge Base
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <File className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No knowledge base documents uploaded yet.</p>
            <p className="text-sm mt-1">Upload PDF documents to help shape your campaign messaging.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5 text-primary" />
          Knowledge Base ({knowledgeBases.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {knowledgeBases.map((kb) => (
              <TableRow key={kb.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-primary" />
                    <span className="font-medium">{kb.fileName}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">{kb.description}</TableCell>
                <TableCell>{formatFileSize(kb.fileSize)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(kb.dateUploaded, { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  {kb.campaigns.length > 0 ? (
                    <Badge variant="secondary">{kb.campaigns.length} campaigns</Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not used</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedPdf(kb)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>{kb.fileName}</DialogTitle>
                        <DialogDescription>{kb.description}</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4 h-[60vh]">
                        <iframe
                          src={kb.content}
                          title={kb.fileName}
                          className="w-full h-full border rounded"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(kb.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseList;
