
import React from 'react';
import { Template } from '@/lib/types';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { FileText, Clock, Tag, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TemplateListProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  selectedId?: string;
}

const TemplateList: React.FC<TemplateListProps> = ({ 
  templates, 
  onSelect,
  selectedId
}) => {
  return (
    <div className="space-y-4">
      {templates.map((template, index) => (
        <AnimatedCard
          key={template.id}
          className={cn(
            "transition-all duration-300 cursor-pointer",
            selectedId === template.id && "border-primary/30 bg-primary/5"
          )}
          animationDelay={index * 100}
          onClick={() => onSelect(template)}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-primary mr-2" />
                <h3 className="font-medium">{template.name}</h3>
              </div>
              
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5 mr-1" />
                <span>Updated {formatDistanceToNow(template.updatedAt, { addSuffix: true })}</span>
              </div>
              
              <div className="mt-4">
                <p className="text-sm line-clamp-2">{template.body}</p>
              </div>
              
              {template.variables.length > 0 && (
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
            
            <Button variant="ghost" size="icon" onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

export default TemplateList;
