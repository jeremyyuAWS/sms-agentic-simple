
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Templates from "./pages/Templates";
import { createContext, useState } from "react";

// Create AppContext
export const AppContext = createContext<any>(null);

function App() {
  const [contacts, setContacts] = useState<any[]>([]);

  // Context value
  const appContextValue = {
    contacts,
    setContacts,
    // Add other state and functions as needed
  };

  return (
    <AppContext.Provider value={appContextValue}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AppContext.Provider>
  );
}

export default App;
