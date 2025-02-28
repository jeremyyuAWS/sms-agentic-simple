
import { useState } from 'react';
import { TemplateCategory } from '@/lib/types';

export const createCategoryActions = (
  setTemplateCategories: React.Dispatch<React.SetStateAction<TemplateCategory[]>>,
  setTemplates: React.Dispatch<React.SetStateAction<any[]>> // Using any here to avoid circular dependencies
) => {
  // Template category actions
  const createTemplateCategory = (category: Omit<TemplateCategory, 'id'>) => {
    const newCategory = {
      ...category,
      id: `category-${Date.now()}`
    };
    setTemplateCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateTemplateCategory = (id: string, updates: Partial<Omit<TemplateCategory, 'id'>>) => {
    setTemplateCategories(prev => prev.map(category => 
      category.id === id ? { ...category, ...updates } : category
    ));
  };

  const deleteTemplateCategory = (id: string) => {
    // Remove the category from all templates first
    setTemplates(prev => prev.map(template => {
      if (template.categoryIds?.includes(id)) {
        return {
          ...template,
          categoryIds: template.categoryIds.filter(catId => catId !== id),
          updatedAt: new Date()
        };
      }
      return template;
    }));
    
    // Then remove the category itself
    setTemplateCategories(prev => prev.filter(category => category.id !== id));
  };

  return {
    createTemplateCategory,
    updateTemplateCategory,
    deleteTemplateCategory
  };
};
