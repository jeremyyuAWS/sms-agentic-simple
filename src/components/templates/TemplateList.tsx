
import React from 'react';
import { Template } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { FileText, Clock, Tag, Edit, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TemplateListProps {
  templates: Template[];
  onEdit: (templateId: string) => void;
  onDelete: (templateId: string) => void;
  selectedTemplateId?: string;
  onSelect?: (templateId: string) => void;
}

const TemplateList: React.FC<TemplateListProps> = ({ 
  templates, 
  onEdit,
  onDelete,
  selectedTemplateId,
  onSelect
}) => {
  return (
    <div className="space-y-4">
      {templates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No templates created yet. Create your first template to get started.</p>
        </div>
      ) : (
        templates.map((template, index) => (
          <AnimatedCard
            key={template.id}
            className={cn(
              "transition-all duration-300 cursor-pointer",
              selectedTemplateId === template.id 
                ? "border-primary border-2 bg-primary/5" 
                : "hover:border-primary/30 hover:bg-primary/5"
            )}
            animationDelay={index * 100}
            onClick={() => onSelect && onSelect(template.id)}
          >
            <div className="flex items-start justify-between">
              <div className="w-full">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-primary mr-2" />
                  <h3 className="font-medium">{template.name}</h3>
                  {selectedTemplateId === template.id && (
                    <Badge className="ml-2 bg-green-500 text-white">
                      <Check className="h-3 w-3 mr-1" /> Selected
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Updated {formatDistanceToNow(
                    typeof template.updatedAt === 'string' 
                      ? new Date(template.updatedAt) 
                      : template.updatedAt, 
                    { addSuffix: true }
                  )}</span>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm line-clamp-2">{template.body}</p>
                </div>
                
                {template.variables && template.variables.length > 0 && (
                  <div className="flex items-center mt-3 flex-wrap gap-2">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="outline" className="text-xs">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 shrink-0">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(template.id);
                  }}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(template.id);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedCard>
        ))
      )}
    </div>
  );
};

export default TemplateList;
