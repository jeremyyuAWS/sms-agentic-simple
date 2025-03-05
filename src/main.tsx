
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react'

// Improved logging throughout startup process
console.log("Application starting...");

// Create root with error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found in the DOM");
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
console.log("Root created successfully");

// Basic fallback for critical errors
const ErrorFallback = ({ error }: { error: Error | string }) => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
    <div className="card p-6 max-w-md w-full bg-white shadow-lg rounded-lg border border-red-200">
      <h1 className="text-xl font-bold mb-2 text-red-600">Something went wrong</h1>
      <p className="text-gray-600 mb-4">The application failed to start. Please try refreshing the page.</p>
      <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto text-red-500 max-h-[300px]">
        {error instanceof Error ? `${error.message}\n\n${error.stack}` : String(error)}
      </pre>
    </div>
  </div>
);

// Render with explicit error handling
console.log("Attempting to render App component");
try {
  // Removed StrictMode to prevent double-rendering which can complicate debugging
  root.render(<App />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Critical error rendering application:", error);
  root.render(<ErrorFallback error={error as Error} />);
}
