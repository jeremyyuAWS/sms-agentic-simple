
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create root with error handling
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

// Wrap app in error boundary
try {
  root.render(<App />);
} catch (error) {
  console.error("Error rendering application:", error);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="card p-6 max-w-md w-full">
        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted-foreground">The application failed to start. Please try refreshing the page.</p>
      </div>
    </div>
  );
}
