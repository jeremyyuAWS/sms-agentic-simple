
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react'

// Create root with error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Render with explicit error handling
console.log("Attempting to render App component");
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("App rendered successfully");
} catch (error) {
  console.error("Critical error rendering application:", error);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="card p-6 max-w-md w-full">
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">The application failed to start. Please try refreshing the page.</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </div>
    </div>
  );
}
