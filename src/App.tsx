
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Campaigns from "./pages/Campaigns";
import SimplifiedCampaigns from "./pages/SimplifiedCampaigns";
import { AppProvider } from "./contexts";
import React, { useEffect } from "react";

function App() {
  // Move useEffect outside of render for cleaner logging
  useEffect(() => {
    console.log("App component mounted");
    return () => console.log("App component unmounting");
  }, []);

  console.log("App component rendering");
  
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/campaigns" element={<Campaigns />} />
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
