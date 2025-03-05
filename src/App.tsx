
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import SimplifiedCampaigns from "./pages/SimplifiedCampaigns";
import { AppProvider } from "./contexts";
import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounting");
  }, []);

  console.log("App component rendering");
  
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          {/* Log statement moved out of direct JSX */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/simplified-campaigns" element={<SimplifiedCampaigns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
