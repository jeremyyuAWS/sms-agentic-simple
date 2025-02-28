
import React, { createContext } from 'react';
import { AppContextProps } from './types';

// Create the context with undefined as default value
export const AppContext = createContext<AppContextProps | undefined>(undefined);

// Create a custom hook for using the context
export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
