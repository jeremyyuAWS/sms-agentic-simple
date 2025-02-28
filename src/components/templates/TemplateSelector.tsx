
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import LoadingState from '@/components/ui/loading-state';

export interface CampaignTemplate {
  id: string;
  name: string;
  body: string;
}

interface TemplateSelectorProps {
  onSelect: (template: CampaignTemplate) => void;
  selectedTemplateId?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, selectedTemplateId }) => {
  const { templates, templateCategories } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filtered templates based on search and category
  const filteredTemplates = React.useMemo(() => {
    if (!templates) return [];
    
    let filtered = templates;
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(t => 
        t.categoryIds && t.categoryIds.includes(activeCategory)
      );
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.body.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [templates, activeCategory, searchQuery]);

  const handleSelect = (template: CampaignTemplate) => {
    onSelect(template);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            {templateCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-2">
          <LoadingState isLoading={isLoading} error={error}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {filteredTemplates.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">
                  No templates found. Try adjusting your search or category filter.
                </p>
              ) : (
                filteredTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer hover:border-primary transition-colors ${
                      selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => handleSelect(template)}
                  >
                    <CardContent className="p-4">
                      <div className="font-medium">{template.name}</div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                        {template.body}
                      </p>
                      {selectedTemplateId === template.id && (
                        <div className="mt-2">
                          <Button size="sm" variant="secondary" className="w-full">Selected</Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </LoadingState>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplateSelector;
