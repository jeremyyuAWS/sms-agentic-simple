
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react'

console.log("Application starting...");

// Create root with improved error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found in the DOM");
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
console.log("Root created successfully");

// Simple error boundary component
const ErrorFallback = ({ error }: { error: Error | string }) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="p-6 max-w-md w-full bg-white shadow-lg rounded-lg border border-red-200">
      <h1 className="text-xl font-bold mb-2 text-red-600">Something went wrong</h1>
      <p className="mb-4">The application failed to start. Please try refreshing the page.</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto text-red-500 max-h-[300px]">
        {error instanceof Error ? `${error.message}\n\n${error.stack}` : String(error)}
      </pre>
    </div>
  </div>
);

// Direct render without StrictMode to reduce complexity
try {
  console.log("Attempting to render App component");
  root.render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Critical error rendering application:", error);
  root.render(<ErrorFallback error={error as Error} />);
}
