
import React from 'react';
import { KnowledgeBase } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileIcon, BookOpen, PlusIcon } from 'lucide-react';

interface KnowledgeBaseListProps {
  knowledgeBases: KnowledgeBase[];
  selectedId?: string;
  onSelect: (knowledgeBaseId?: string) => void;
  onUpload?: () => void;
  onDeleteKnowledgeBase?: (id: string) => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  knowledgeBases,
  selectedId,
  onSelect,
  onUpload,
  onDeleteKnowledgeBase
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Knowledge Bases</h3>
        {onUpload && (
          <Button onClick={onUpload} variant="outline" size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {knowledgeBases.map(kb => (
          <Card 
            key={kb.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedId === kb.id ? 'border-primary border-2' : ''
            }`}
            onClick={() => onSelect(kb.id === selectedId ? undefined : kb.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <FileIcon className="h-6 w-6 text-blue-500" />
                {kb.fileType === 'pdf' && <span className="text-xs bg-muted px-2 py-1 rounded">PDF</span>}
              </div>
              <CardTitle className="text-base mt-2">{kb.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">{kb.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(kb.dateUploaded).toLocaleDateString()}
                </span>
                {onDeleteKnowledgeBase && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteKnowledgeBase(kb.id);
                    }}
                  >
                    <span className="sr-only">Delete</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {knowledgeBases.length === 0 && (
          <div className="col-span-full text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium">No Knowledge Bases Available</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Upload documents to help answer customer questions
            </p>
            {onUpload && (
              <Button onClick={onUpload} variant="outline" size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Upload New
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBaseList;
